
import { DocumentNode, isListType } from "graphql";
import request from "graphql-request";
import gql from "graphql-tag";
import { assertValidSDLExtension } from "graphql/validation/validate";
const THE_GRAPH_URL: string =
  "https://api.thegraph.com/subgraphs/name/kinalibilgehan/menthol";
interface IWalletVar {
  id: string;
}
interface IDepositedPools {
  users: {
    deposits: Array<string>
  }[];
}
interface poolVar {
  id: string;
}
interface ICoolPoolInfo {
  coolPools: {
    totalCO2Offset: BigInt,
    totalTxCovered: BigInt,
    totalDepositorCount: number,
    greenToken: string
  }[];
}
interface ICreatorPools {
  coolPools: {
    id: string;
  }[];
}
const fetcherDepositedPools = async (query: DocumentNode, id: IWalletVar): Promise<IDepositedPools> =>
  request(THE_GRAPH_URL, query, id);
const fetcherCoolPoolInfo = async (query: DocumentNode, id: poolVar): Promise<ICoolPoolInfo> =>
  request(THE_GRAPH_URL, query, id);
const fetcherCreatorPools = async (query: DocumentNode, id: IWalletVar): Promise<ICreatorPools> =>
  request(THE_GRAPH_URL, query, id);


const getDepositedPools = async (id: string) => {
  const variables: IWalletVar = {
    id: id,
  };
  const depositors = gql`
    query Depositors ($id: ID!) {
      users (where: {id: $id}) {
        deposits {
          id
        }
      }
    }
  `;
  const depositedPools: string[] = [];
  const data = await fetcherDepositedPools(depositors, variables);
  const deposits = data.users[0].deposits;
  for (var deposit of deposits) {
    const poolID = Object.values(deposit)[0].split("-",1)[0]
    depositedPools.push(poolID)
  }
  // console.log(depositedPools)
  return depositedPools
};
const getCoolPoolInfo = async (id: string) => {
  const variables: poolVar = {
    id: id,
  };
  // console.log(variables)
  const coolPools = gql`
    query CoolPools($id: ID!) {
      coolPools (where: {id: $id}){
        totalCO2Offset
        totalTxCovered
        totalDepositorsCount
        greenToken
      }
    }
  `;
  const data = await fetcherCoolPoolInfo(coolPools, variables);
  return data
}
const getCreatorPools = async(id: string) => {
  const variables: IWalletVar = {
    id: id,
  };
  const creators = gql`
  query Creators($id: ID!) {
    coolPools (where: {creator: $id}) {
      id
    }
  }
`;
  const creatorPools: string[] = [];
  const data = await fetcherCreatorPools(creators, variables);
  const coolPools = data.coolPools
  // console.log(coolPools)
  for (var coolPool of coolPools) {
    const poolID = Object.values(coolPool)[0]
    creatorPools.push(poolID)
  }
  return creatorPools
}

async function main() {
  const mailPools: string[] = [];
  const creatorPools = await getCreatorPools("0xe084365c01b72d9dd53e4742f6cb114e310e5099");
  const depositedPools = await getDepositedPools("0xe084365c01b72d9dd53e4742f6cb114e310e5099");

  console.log(creatorPools)
  // console.log(depositedPools)


  for(let i=0;i<creatorPools.length;i++){
    if(mailPools.indexOf(creatorPools[i]) == -1)
       mailPools.push(creatorPools[i])
  }
  for(let i=0;i<depositedPools.length;i++){
    if(mailPools.indexOf(depositedPools[i]) == -1)
       mailPools.push(depositedPools[i])
  }
  for (let i=0;i<mailPools.length;i++) {
    const poolInfo = await getCoolPoolInfo(mailPools[i])
    const offset = poolInfo.coolPools[0].totalCO2Offset
    const transactions = poolInfo.coolPools[0].totalTxCovered;
    const greenToken = poolInfo.coolPools[0].greenToken;
    const poolMail = `The coolPool offset ${offset}  tons of co2 for ${transactions} transactions.`
    console.log(poolMail)
  }
}
if (require.main === module) {
  main()
    .then(() => {
      console.log("I am here");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
/**
 * DB => Sendgrid'de
 * Mail atmak icin => Sendgrid'e soylicez
 *
 * 1. Sendgrid'e hangi user'larin subscribe oldugunu sor. Wallet ve mail adresi gelecek
 * 2. Her bir user wallet icin:
 *    - Subgraph'e depositor veya creator oldugu pool'lari sor
 *    - Her bir pool icin:
 *       - Bu cumleyi olusturucaz: "The CoolPool offset 5 tons of co2 for 543 txs. Your contribution was 159 kgs with a cost of 3 dollars. In total 89 dolars worth of green tokens are retired"
 *    - (3) Her bir pool icin olusturdugumuz cumleleri, tek bir mailde user'a gonder. Bunun icin Sendgrid'e API call yapilacak
 *
 * Sendgrid bizim kim oldugumuzu anlamak icin API key soracak. Bu key'leri .env dosyasinda tutacagiz. Erdem paylasacak.
 *
 * 
 */
/**
 * Example Mail:
 *
 * Hello dear blabla,
 *
 * The CoolPool number 5 that you are the depositor of offset 5 tons of co2 for 543 txs. Your contribution was 159 kgs with a cost of 3 dollars. In total 89 dolars worth of green tokens are retired
 * The CoolPool number 7 that you are the depositor of offset 5 tons of co2 for 543 txs. Your contribution was 159 kgs with a cost of 3 dollars. In total 89 dolars worth of green tokens are retired
 * The CoolPool number 8 that you are the creator of offset 5 tons of co2 for 543 txs. Your contribution was 159 kgs with a cost of 3 dollars. In total 89 dolars worth of green tokens are retired
 */
// 1) get contact list
// (where: {creator: "0x5c6c07d4f9018eaaae70c2abbb1d054d9637e14e"})
// (where: {creator: "0xe084365c01b72d9dd53e4742f6cb114e310e5099"})