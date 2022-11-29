import { DocumentNode } from "graphql";
import request from "graphql-request";
import gql from "graphql-tag";
import { assertValidSDLExtension } from "graphql/validation/validate";

const THE_GRAPH_URL: string =
  "https://api.thegraph.com/subgraphs/name/kinalibilgehan/menthol";

const query = gql`
  query Users {
    users {
      id
    }
  }
`;

interface IQuery {
  users: {
    id: string;
  }[];
}

const fetcher = async (query: DocumentNode): Promise<IQuery> =>
  request(THE_GRAPH_URL, query);

const getQuery = async () => {
  const data = await fetcher(query);
  console.log(data.users[0].id);
};

async function main() {
  console.log("hello");
  await getQuery();
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
