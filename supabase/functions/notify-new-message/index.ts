// @ts-nocheck
// supabase/functions/notify-new-message/index.ts

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const payload = await req.json()

    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({ skipped: true, reason: 'Bukan event INSERT' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { name, email, subject, message, created_at } = payload.record

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL')

    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY tidak ditemukan')
    if (!OWNER_EMAIL) throw new Error('OWNER_EMAIL tidak ditemukan')

    const receivedAt = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta',
    }).format(new Date(created_at))

    const replySubject = encodeURIComponent(`Re: ${subject || 'Pesan dari Personal Profile'}`)
    const replyBody = encodeURIComponent(`Hi ${name},\n\n`)

    const emailHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Pesan Baru</title>
</head>
<body style="margin:0;padding:0;background-color:#080808;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080808;padding:52px 16px 64px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;width:100%;">

          <!-- ── EYEBROW BADGE ── -->
          <tr>
            <td style="padding:0 0 18px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:100px;padding:5px 14px 5px 12px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:5px;height:5px;background:rgba(255,255,255,0.5);border-radius:50%;vertical-align:middle;"></td>
                        <td style="padding-left:8px;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);white-space:nowrap;">Personal Profile</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── MAIN CARD ── -->
          <tr>
            <td style="background:#0e0e0e;border-radius:18px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;">

              <!-- Top shimmer line -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1) 40%,rgba(255,255,255,0.06) 60%,transparent);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- ── HEADER ── -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:32px 34px 28px;">
                    <p style="margin:0 0 9px;font-size:10px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:rgba(255,255,255,0.22);">Notifikasi Masuk</p>
                    <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;line-height:1.2;">Pesan baru masuk</h1>
                  </td>
                </tr>
              </table>

              <!-- ── DIVIDER ── -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 34px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="height:1px;background:rgba(255,255,255,0.06);font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ── BODY ── -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 34px 34px;">

                    <!-- Nama & Email — 2 col -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                      <tr>
                        <td width="50%" valign="top" style="padding-right:5px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:#151515;border:1px solid rgba(255,255,255,0.07);border-radius:11px;padding:15px 16px;">
                                <p style="margin:0 0 5px;font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.22);">Nama</p>
                                <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;letter-spacing:-0.01em;line-height:1.3;">${name}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="50%" valign="top" style="padding-left:5px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:#151515;border:1px solid rgba(255,255,255,0.07);border-radius:11px;padding:15px 16px;">
                                <p style="margin:0 0 5px;font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.22);">Email</p>
                                <a href="mailto:${email}" style="display:block;font-size:13px;font-weight:500;color:rgba(255,255,255,0.6);text-decoration:none;line-height:1.3;word-break:break-all;">${email}</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    ${subject ? `
                    <!-- Subjek -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                      <tr>
                        <td style="background:#151515;border:1px solid rgba(255,255,255,0.07);border-radius:11px;padding:15px 16px;">
                          <p style="margin:0 0 5px;font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.22);">Subjek</p>
                          <p style="margin:0;font-size:14px;font-weight:600;color:rgba(255,255,255,0.82);letter-spacing:-0.01em;">${subject}</p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}

                    <!-- Pesan -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="background:#151515;border:1px solid rgba(255,255,255,0.07);border-radius:11px;padding:16px;">
                          <p style="margin:0 0 10px;font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.22);">Pesan</p>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="2" style="background:rgba(255,255,255,0.12);border-radius:2px;vertical-align:top;padding:2px 0;">&nbsp;</td>
                              <td style="padding-left:13px;">
                                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.68);line-height:1.8;white-space:pre-wrap;">${message}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <a href="mailto:${email}?subject=${replySubject}&body=${replyBody}"
                             style="display:block;background:#ffffff;color:#000000;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px;border-radius:10px;text-decoration:none;text-align:center;">
                            Balas Pesan
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- ── FOOTER ── -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.05);padding:14px 34px 22px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:0.03em;">Personal Profile · Contact Form</p>
                        </td>
                        <td align="right">
                          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:0.02em;">${receivedAt}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Personal Profile <onboarding@resend.dev>',
        to: [OWNER_EMAIL],
        subject: `✉️ ${name} — ${subject || 'Pesan baru dari Personal Profile'}`,
        html: emailHtml,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Resend API error: ${res.status} — ${errText}`)
    }

    const result = await res.json()
    console.log('[notify-new-message] Email berhasil dikirim:', result)

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('[notify-new-message] Error:', err)
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})