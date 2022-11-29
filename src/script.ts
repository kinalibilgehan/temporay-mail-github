import { IPoolData } from "./interfaces";
import { getContacts, sendEmailDynamic } from "./sendgrid";
import { getCoolPoolInfo, getCreatorPools, getDepositedPools, getPools } from "./subgraph";
import cron from 'node-cron';

// Use subgraph api to get and generate data for Dynamic Template on SendGrid
async function createTemplateData(wallet_address: string) {

    let mailContent: any[] = [];
    const mailPools = await getPools(wallet_address)


    for (let i = 0; i < mailPools.length; i++) {
        let poolData = {} as IPoolData;
        // const poolData: { [key: string]: string | BigInt } = {};
        const poolInfo = await getCoolPoolInfo(mailPools[i])
        // console.log(poolInfo)
        poolData["offset"] = poolInfo.coolPools[0].totalCO2Offset
        poolData["transactions"] = poolInfo.coolPools[0].totalTxCovered;
        poolData["greenToken"] = poolInfo.coolPools[0].greenToken;
        // const dataString = JSON.stringify(poolData)
        // mailContent[i]= JSON.parse(dataString)
        mailContent[i] = poolData;
    }
    return mailContent;
}

async function main() {
  const contacts = await getContacts();
  for (let i = 0; i < contacts.length; i++) {
      const email = contacts[i].email;
      const wallet = contacts[i].address_line_1;
      const mailContent = await createTemplateData(wallet)
      const mailString = JSON.stringify(mailContent)
      const mailObj = JSON.parse(mailString)
      const lastmailObj = {"mailContent": mailObj}
      console.log(mailObj)
      
      
      await sendEmailDynamic(email, lastmailObj);
      
    }
  }

  if (require.main === module) {
    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  }
  
  
  
  // cron.schedule(`*/1 * * * *`, async () => {
    //   console.log('running your task...');
    //   const contacts = await getContacts();
    //   // console.log(contacts)
    //   for (let i = 0; i < contacts.length; i++) {
      //       const email = contacts[i].email;
      //       const wallet = contacts[i].address_line_1;
      //       const mailContent = await createTemplateData(wallet)
      //       console.log(mailContent)
      
      //       // const htmlContent = JSON.stringify(mailContent)
      //       // const htmlContent = JSON.stringify({mailContent})
      //       // const htmlObj = { "mailContent": mailContent}
      //       // console.log(htmlObj)
      //       // console.log(htmlContent)
      // // await sendEmailDynamic(email, htmlObj);
//   }
  
// });

