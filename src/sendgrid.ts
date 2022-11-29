
import client from "@sendgrid/client";
import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY, SEND_EMAIL_FROM } from "./init";

//https://docs.sendgrid.com/api-reference/contacts/add-or-update-a-contact


// Get all contact data from sendgrid
export async function getContacts(): Promise<any> {
  let r: any[] = [];
  client.setApiKey(SENDGRID_API_KEY);

  const req = client.createRequest({
    url: '/v3/marketing/contacts',
    method: 'GET',
  });

  await client.request(req)
    .then(([response]: any) => {
      r = response.body.result;
    })
    .catch((error: any) => {
      console.error(error);
    })
  return r;
}

//https://docs.sendgrid.com/api-reference/mail-send/mail-send
// Send a basic email to one contact with a html body
export function sendEmail(email: string, htmlBody: string) {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: SEND_EMAIL_FROM,
    subject: 'Weekly Digest',
    //   text: 'required - text version of html body',
    html: htmlBody,
  };
  sgMail.send(msg);
}

export async function sendEmailDynamic(email: string, htmlContent:Record<string, any>): Promise<any> {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const data = {
    from: SEND_EMAIL_FROM,
    to: email,
    subject: "Weekly Digest",
    templateId: "d-87e197154f2f4c5ab6ca3f605bf86932",
    dynamic_template_data: htmlContent,
    mailSettings: {
      bypassListManagement: {
        enable: false
      },
      footer: {
        enable: false
      },
      sandboxMode: {
        enable: false
      }
    },
    trackingSettings: {
      clickTracking: {
        enable: true,
        enableText: false
      },
      openTracking: {
        enable: true,
        substitutionTag: '%open-track%'
      },
      subscriptionTracking: {
        enable: false
      }
    }
  };
  await sgMail
    .send(data)
    .then(() => console.log('Mail sent successfully'))
    .catch(error => {
      console.error(error);
    });
}



// Comment this in production
// async function nameMe() {
//   const contacts = await getContacts();
//   return contacts;
// }
// (async () => {
//   const contacts = await nameMe();
//   for (let i = 0; i < contacts.length; i++) {
//     const email = contacts[i].email;
//     const wallet_address = contacts[i].address_line_1;
//     const exampleContent = {
//       coolpools: [
//         {
//           id: "1",
//           offset_amount: "1",
//           no_of_tx: "1",
//           offset_cost: "1",
//           total_retired_cost: "1",
//           contribution: "wallet_address"
//         }
//       ]
//     };
//     sendEmailDynamic(email, exampleContent);
//   }
// })();