import { DocumentNode, isListType } from "graphql";
import request from "graphql-request";
import gql from "graphql-tag";
import { THE_GRAPH_URL } from "./init";
import { ICoolPoolInfo, ICreatorPools, IDepositedPools, IWalletVar, poolVar } from './interfaces';

const fetcherDepositedPools = async (query: DocumentNode, id: IWalletVar): Promise<IDepositedPools> =>
  request(THE_GRAPH_URL, query, id);
const fetcherCoolPoolInfo = async (query: DocumentNode, id: poolVar): Promise<ICoolPoolInfo> =>
  request(THE_GRAPH_URL, query, id);
const fetcherCreatorPools = async (query: DocumentNode, id: IWalletVar): Promise<ICreatorPools> =>
  request(THE_GRAPH_URL, query, id);


export const getDepositedPools = async (id: string) => {
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

export const getCoolPoolInfo = async (id: string) => {
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

export const getCreatorPools = async(id: string) => {
  const variables: IWalletVar = {
    id: id,
  };
  const creators = gql`
  query Creators ($id: ID!) {
    coolPools (where: {creator: $id}) {
      id
    }
  }
`;
  const creatorPools: string[] = [];
  const data = await fetcherCreatorPools(creators, variables);
  const coolPools = data.coolPools
  for (var coolPool of coolPools) {
    const poolID = Object.values(coolPool)[0]
    creatorPools.push(poolID)
  }
  return creatorPools
}

export const getPools = async(id:string) => {
  const mailPools: string[] = [];
  const creatorPools = await getCreatorPools(id);
    // console.log(creatorPools)
  const depositedPools = await getDepositedPools(id);
    // console.log(depositedPools)
  for (let i = 0; i < creatorPools.length; i++) {
      if (mailPools.indexOf(creatorPools[i]) == -1)
          mailPools.push(creatorPools[i])
  }
  for (let i = 0; i < depositedPools.length; i++) {
      if (mailPools.indexOf(depositedPools[i]) == -1)
          mailPools.push(depositedPools[i])
  }

  return mailPools
}