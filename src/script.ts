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
        mailContent[i]= poolData
    }
    return mailContent;
}

async function main() {
  const contacts = await getContacts();
  for (let i = 0; i < contacts.length; i++) {
      const email = contacts[i].email;
      const wallet = contacts[i].address_line_1;
      const mailContent = await createTemplateData(wallet)
      console.log(mailContent)
      
      
      await sendEmailDynamic(email, {"mailContent":[{"offset":"2323004313","transactions":"4926","greenToken":"0xd066db51a6654fdf8df677226aa31e3c9a7a3535"},{"offset":"0","transactions":"0","greenToken":"0xf7c94d8417a67e8b897f1514fdc3b748427f7324"},{"offset":"0","transactions":"0","greenToken":"0x8378ed7349ded5013d4eb4299bc41bfc209533f9"},{"offset":"0","transactions":"0","greenToken":"0x839e7cf6c144d2ce9e84921d08eaf9997d9ae34d"},{"offset":"0","transactions":"0","greenToken":"0xf065b5df8f9ad04d11d1a40fcb0ca76a1144c43a"},{"offset":"0","transactions":"0","greenToken":"0x839e7cf6c144d2ce9e84921d08eaf9997d9ae34d"}]});
      
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

