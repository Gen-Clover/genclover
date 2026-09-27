# Microsoft 365 mail setup for the website

How the website sends email through Gen Clover's own Microsoft 365, what was configured to
make that work, and how to maintain it. Written as a runbook: every change made in the
Microsoft admin portals and in PowerShell is recorded here with the exact command used.

> **This repository is public.** No IDs or secrets are recorded in this file. Where a value
> is needed, the file says where to find it. The client secret lives only in Vercel.

| | |
|---|---|
| Set up | 26 September 2026 |
| Set up by | rakesh@genclover.com (Global Administrator) |
| Microsoft 365 tenant | GenClover (genclover.com) |
| Used by | `api/lead.js` (Start a Project form) on the Vercel project `genclover` |

---

## 1. How it works

```
Visitor submits the brief on genclover.com/start-a-project
        │
        ▼
Vercel function  /api/lead            validates the brief, builds the email (api/_leadEmail.js)
        │  1. signs in as the app gc-website-mail  (client ID + client secret → access token)
        ▼
Microsoft Graph  POST /users/no-reply@genclover.com/sendMail
        │  2. Exchange checks the application access policy:
        │     gc-website-mail may only act on members of gc-app-website-mail-senders
        ▼
Exchange Online sends from no-reply@genclover.com  (SPF passes: Microsoft is in our SPF record)
        │  a copy is saved in no-reply@'s Sent Items
        ▼
contact@genclover.com  (and any other LEAD_NOTIFY_TO address)
        Reply goes to the person who submitted the brief (reply-to), never to no-reply@
        │
        │  3. then, the thank-you to the inquirer (never fatal: if it fails, the inquiry
        │     is still captured and the visitor still sees success)
        ▼
Microsoft Graph  POST /users/contact@genclover.com/sendMail
        ▼
The inquirer's email address, CC contact@genclover.com
        Reply goes to contact@. A copy is also in contact@'s Sent Items.
```

### Sender policy

| Email | Sent from | To | Replies go to |
|---|---|---|---|
| Internal notification (a new inquiry) | `no-reply@genclover.com` | `LEAD_NOTIFY_TO` | The inquirer (reply-to) |
| Thank-you to the inquirer | `contact@genclover.com` | The inquirer, CC contact@ | contact@ (monitored inbox) |
| Anything else sent to people outside the company | `contact@genclover.com` | | contact@ |

The thank-you repeats only what the inquirer picked from our option lists (service, business
type, location, timeline, budget) and their first name if it looks like a name. It never
repeats their free-text message. Anyone can type any address into the public form, so
echoing their text would let a spammer send it to a stranger from our domain.

`no-reply@` rejects incoming mail with a message pointing to contact@ (section 4.3).

---

## 2. Naming convention

Everything created for this follows the convention in the README, so future apps sort
together and describe the job rather than a person or vendor. One app registration per
capability, so each has only the permission it needs.

| Thing | Pattern | Created |
|---|---|---|
| Entra app registration | `gc-<system>-<capability>` | `gc-website-mail` |
| Client secret description | `<where-used>-<yyyy-mm created>` | `vercel-2026-09` |
| Sending-permission group | `gc-app-<app>-senders` | `gc-app-website-mail-senders@genclover.com` (hidden) |
| Shared mailbox | the role, not a person | `no-reply@genclover.com` |
| Mailbox display name | "Gen Clover" + team | "Gen Clover" |
| Exchange mail flow rule | `gc-mailflow-<action>-<target>` | `gc-mailflow-reject-no-reply` |
| Vercel variable | `MS_<CAPABILITY>_<VALUE>` | `MS_MAIL_CLIENT_ID`, `MS_MAIL_CLIENT_SECRET` (`MS_TENANT_ID` is shared) |

---

## 3. Microsoft Entra admin center (entra.microsoft.com)

### 3.1 App registration `gc-website-mail`

**Entra ID → App registrations → + New registration**

| Field | Value |
|---|---|
| Name | `gc-website-mail` |
| Supported account types | Single tenant only – GenClover |
| Redirect URI | *(none; the app signs in as itself, not as a user)* |

On the app's **Overview** page:

| Value | Used as | Secret? |
|---|---|---|
| Application (client) ID | Vercel `MS_MAIL_CLIENT_ID`, PowerShell `$appId` | No |
| Directory (tenant) ID | Vercel `MS_TENANT_ID` | No |

### 3.2 API permissions

**gc-website-mail → API permissions**

| Change | Detail |
|---|---|
| Added | Microsoft Graph → **Application** permission → `Mail.Send` |
| Removed | Microsoft Graph → Delegated → `User.Read` (default, not needed) |
| Granted | **Grant admin consent for GenClover** → status *Granted for GenClover* |

On its own, `Mail.Send` (application) allows sending as **any** mailbox. It is narrowed to
`no-reply@` by the application access policy in section 4.4.

### 3.3 Client secret

**gc-website-mail → Certificates & secrets → Client secrets → + New client secret**

| Field | Value |
|---|---|
| Description | `vercel-2026-09` |
| Expires | 24 months (about September 2028; the exact date is shown in the Expires column) |
| Value | Copied once into Vercel `MS_MAIL_CLIENT_SECRET`. **Not recorded anywhere else.** |

Use the **Value** column, not *Secret ID*. See section 7 for renewal.

---

## 4. Exchange Online PowerShell

All commands were run in **Windows PowerShell 5.1**, as Administrator.

### 4.1 One-time machine setup (installing the Exchange module)

The first attempt failed in two ways:

- `Install-Module` stopped with *"Source Location … is not valid"* / *"Package
  'ExchangeOnlineManagement' failed to download"*. Windows PowerShell 5.1 defaults to an old TLS
  version that the PowerShell Gallery refuses.
- `Connect-ExchangeOnline` then failed with *"…the module could not be loaded"*
  (`CouldNotAutoloadMatchingModule`). The module was only half installed, and the execution
  policy was *Undefined* at every scope.

Fixed with:

```powershell
# Use TLS 1.2 for this session (the PowerShell Gallery requires it)
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

# Package provider that PowerShellGet needs
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force

# Trust Microsoft's official gallery, so installs do not prompt
Set-PSRepository -Name PSGallery -InstallationPolicy Trusted

# Exchange Online module (installed version 3.10.1), replacing the half-installed copy
Install-Module -Name ExchangeOnlineManagement -Scope CurrentUser -Force -AllowClobber

# Allow signed modules to load for this Windows user (was Undefined at every scope)
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

Import-Module ExchangeOnlineManagement
```

On a new machine, run the same block once. PowerShell 7 (`winget install --id Microsoft.PowerShell`)
avoids the TLS step.

### 4.2 Connect

```powershell
Connect-ExchangeOnline -UserPrincipalName rakesh@genclover.com
```

### 4.3 Shared mailbox `no-reply@genclover.com` and the bounce rule

```powershell
# Shared mailbox: no licence, no password, sign-in blocked by default
New-Mailbox -Shared -Name "no-reply" -DisplayName "Gen Clover" -Alias no-reply -PrimarySmtpAddress no-reply@genclover.com

# Let the administrator open it in Outlook (to see Sent Items)
Add-MailboxPermission -Identity no-reply@genclover.com -User rakesh@genclover.com -AccessRights FullAccess -AutoMapping $true

# Reject anything sent TO no-reply@ (sending FROM it is unaffected)
New-TransportRule -Name "gc-mailflow-reject-no-reply" -SentTo no-reply@genclover.com `
  -RejectMessageReasonText "This address does not accept replies. Please email contact@genclover.com." `
  -RejectMessageEnhancedStatusCode "5.7.1"
```

What the session showed:

- **Before creating it,** `Get-Mailbox -Identity no-reply@genclover.com` returned nothing, so the
  mailbox did not exist yet.
- **`New-Mailbox`** created it (Name `no-reply`, alias `no-reply`, hosted in Microsoft's India
  region, `INDPRD01`). It printed four *"An error occurred while trying to prepopulate newly created
  mailbox … Error: 0x8004010F"* warnings. These are harmless: the mailbox had not finished
  replicating, and the next commands against it worked normally.
- **`Add-MailboxPermission`** granted `FullAccess` to rakesh@genclover.com.
- **`New-TransportRule`** warned that *"RejectMessageReasonText … can't be reversed"*. That is
  expected: rejected mail is not kept. The rule was created **Enabled**, in **Enforce** mode, at
  **priority 0**. PowerShell enables rules immediately, unlike the Exchange admin center, where new
  rules start disabled.

### 4.4 Restrict the app to `no-reply@` (application access policy)

There is no admin-portal screen for this; it can only be done in PowerShell.

```powershell
$appId = "<Application (client) ID of gc-website-mail, from section 3.1>"

# Hidden, mail-enabled security group listing the mailboxes the website may send from
New-DistributionGroup -Name "gc-app-website-mail-senders" -Alias gc-app-website-mail-senders `
  -PrimarySmtpAddress gc-app-website-mail-senders@genclover.com -Type Security -Members no-reply@genclover.com
Set-DistributionGroup gc-app-website-mail-senders -HiddenFromAddressListsEnabled $true

# gc-website-mail may only act on members of that group
New-ApplicationAccessPolicy -AppId $appId -PolicyScopeGroupId gc-app-website-mail-senders@genclover.com `
  -AccessRight RestrictAccess -Description "gc-website-mail may only send from approved mailboxes"
```

The ID must be in quotes. Without them, PowerShell tries to run it as a command
(*"The term '…' is not recognized as the name of a cmdlet"*).

The block was accidentally run twice. The first run created the group (`Universal,
SecurityEnabled`) and the policy (`IsValid : True`). The second run changed nothing: it
reported *"multiple recipients matching identity"*, *"no settings … modified"* and
*"Duplicate policy found"*, because each object already existed. The checks in 4.5 confirm
there is exactly one of each.

### 4.5 Verification (results at setup)

```powershell
Get-Recipient -Identity "*gc-app-website-mail-senders*" | Format-Table Name,RecipientTypeDetails,PrimarySmtpAddress
Get-DistributionGroupMember gc-app-website-mail-senders@genclover.com | Format-Table Name,PrimarySmtpAddress
Get-ApplicationAccessPolicy | Format-Table AppId,ScopeName,AccessRight
Test-ApplicationAccessPolicy -Identity no-reply@genclover.com -AppId $appId | Format-List AccessCheckResult
Test-ApplicationAccessPolicy -Identity contact@genclover.com  -AppId $appId | Format-List AccessCheckResult
Get-Mailbox no-reply@genclover.com | Format-List DisplayName,PrimarySmtpAddress,RecipientTypeDetails
Get-TransportRule gc-mailflow-reject-no-reply | Format-List Name,State
```

Recorded from the setup session output on 26 September 2026:

| Check | Result |
|---|---|
| Group | One `gc-app-website-mail-senders`, `MailUniversalSecurityGroup` |
| Members | `no-reply@genclover.com` only |
| Policy | One: app `gc-website-mail` → `gc-app-website-mail-senders`, `RestrictAccess` |
| Access test, no-reply@ | `AccessCheckResult : Granted` |
| Access test, contact@ | `AccessCheckResult : Denied` |
| Mailbox | `DisplayName : Gen Clover`, `RecipientTypeDetails : SharedMailbox` |
| Bounce rule | `State : Enabled`, `SentTo : no-reply@genclover.com` |

### 4.6 Disconnect

```powershell
Disconnect-ExchangeOnline -Confirm:$false
```

---

## 5. Vercel (project `genclover` → Settings → Environment Variables)

Each variable is set for **Production** and **Preview**.

| Variable | Value | Notes |
|---|---|---|
| `MS_TENANT_ID` | Directory (tenant) ID | Section 3.1 |
| `MS_MAIL_CLIENT_ID` | Application (client) ID | Section 3.1 |
| `MS_MAIL_CLIENT_SECRET` | Client secret **Value** | Section 3.3. Marked **Sensitive** |
| `LEAD_NOTIFY_FROM` | `no-reply@genclover.com` | Also the code's default |
| `LEAD_NOTIFY_TO` | `contact@genclover.com,gencloverai@gmail.com` | One address, or several separated by commas |
| `LEAD_CONFIRM_FROM` | *(not set)* | Default `contact@genclover.com`. Set to `off` to stop the thank-you email |
| `LEAD_CONFIRM_CC` | *(not set)* | Default `contact@genclover.com`. Comma-separated, or `none` for no copy |

Settings only apply to deployments made after they are saved, so redeploy after changing them.
All three `MS_*` variables must exist in an environment, or that environment's form reports
*"not reachable"*. This happened at setup, when `MS_MAIL_CLIENT_ID` had been missed.
`RESEND_API_KEY` has been deleted.

---

## 6. DNS (GoDaddy): current state and the optional DKIM step

Nothing had to change in DNS for sending: the existing records already authorise Microsoft.

| Record | Value | Owner |
|---|---|---|
| MX `@` | `genclover-com.mail.protection.outlook.com` | Microsoft 365 (receiving) |
| TXT `@` (SPF) | `v=spf1 include:spf.protection.outlook.com -all` | Microsoft 365 (sending) |
| TXT `_dmarc` | `p=quarantine; adkim=r; aspf=r` | Domain policy |
| CNAME `selector1._domainkey`, `selector2._domainkey` | **Not yet created** | DKIM, recommended |

**Recommended: enable DKIM.** In **security.microsoft.com → Email & collaboration → Policies &
rules → Threat policies → Email authentication settings → DKIM → genclover.com**, copy the two
CNAME values into GoDaddy DNS (names `selector1._domainkey` and `selector2._domainkey`), wait
for DNS, then switch **Sign messages for this domain with DKIM signatures** to *Enabled*. Do not
change the MX, SPF or DMARC records.

---

## 7. Maintenance

### Renewing the client secret (before about September 2028)
1. **gc-website-mail → Certificates & secrets → + New client secret**, description
   `vercel-<yyyy-mm>`, 24 months.
2. Paste the new **Value** into Vercel `MS_MAIL_CLIENT_SECRET` (Production and Preview) and redeploy.
3. Submit a test brief, then delete the old secret.

Set a calendar reminder two weeks before the expiry date. If the secret expires, inquiry
emails stop and visitors see *"We could not send your inquiry just now."*

### If the secret leaks
Delete it immediately in **Certificates & secrets**, then follow the renewal steps. Because
of the access policy, a leaked secret could only send as `no-reply@`.

### Allowing contact@ to send (needed for the thank-you email)
The thank-you is sent from contact@, so contact@ must be in the access policy group.
Until it is, the thank-you fails with `403 ErrorAccessDenied` in the logs, while the
inquiry itself still goes through.
```powershell
Connect-ExchangeOnline -UserPrincipalName <admin>
Add-DistributionGroupMember gc-app-website-mail-senders -Member contact@genclover.com
Test-ApplicationAccessPolicy -Identity contact@genclover.com -AppId "<client ID>" | Format-List AccessCheckResult   # expect Granted
Disconnect-ExchangeOnline -Confirm:$false
```
Allow up to an hour for the change to take effect. After this, a leaked secret could send as
no-reply@ or contact@, but still no other mailbox.

### Auditing
- The app's sign-ins: **entra.microsoft.com → Enterprise applications → gc-website-mail → Sign-in logs**
- Sent notifications: `no-reply@genclover.com` → Sent Items. Thank-yous: `contact@genclover.com` → Sent Items
- Delivery failures: **Vercel → Logs**, filter `/api/lead`, lines starting `[lead] Delivery failed:`
  (the inquiry) or `[lead] Confirmation failed` (the thank-you only)
- Quarantined mail: **security.microsoft.com → Quarantine**

---

## 8. Rollout checklist

- [x] App registration `gc-website-mail` (section 3.1)
- [x] `Mail.Send` application permission, admin consent granted (3.2)
- [x] Client secret `vercel-2026-09` (3.3)
- [x] Shared mailbox `no-reply@`, display name "Gen Clover" (4.3)
- [x] Bounce rule `gc-mailflow-reject-no-reply` enabled (4.3)
- [x] Access policy restricting the app to `gc-app-website-mail-senders`, tested (4.4, 4.5)
- [x] Vercel variables for Production and Preview (5)
- [x] Code pushed to `dev`; test brief on dev.genclover.com arrived from "Gen Clover
      &lt;no-reply@genclover.com&gt;", and Reply addressed the inquirer
- [x] Released to `main` (#17); `RESEND_API_KEY` removed from Vercel
- [ ] Resend API key deleted in Resend
- [ ] contact@ added to `gc-app-website-mail-senders`, tested Granted (section 7)
- [ ] Thank-you email released; a test brief sends the inquirer a thank-you from contact@, CC contact@
- [ ] DKIM enabled (6, recommended)

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Form: *"inquiry system is not reachable"* (503) | A `MS_*` variable is missing in that environment (at setup it was `MS_MAIL_CLIENT_ID`) | Add it for Preview/Production and redeploy |
| Inquiry arrives, but no thank-you; log `[lead] Confirmation failed … 403` | contact@ is not in the access policy group | Section 7, "Allowing contact@ to send" |
| Log: `AADSTS7000215` / invalid client secret | Secret ID used instead of Value, or the secret expired | New secret, paste its **Value** |
| Log: `AADSTS700016` / application not found | Wrong client or tenant ID | Copy both again from the app's Overview page |
| Log: `403 ErrorAccessDenied` | Consent missing, mailbox not in the group, or the policy is still taking effect (up to about an hour) | Check 3.2 and run the 4.5 tests |
| Log: `404 ErrorInvalidUser` | `LEAD_NOTIFY_FROM` typo, or the mailbox is missing | Check `Get-Mailbox no-reply@genclover.com` |
| Email lands in spam | New sender with no reputation yet | Mark *Not spam*; enable DKIM (6) |
