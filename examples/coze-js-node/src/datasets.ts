/* eslint-disable @typescript-eslint/naming-convention */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'fs';

import { client, datasetId } from './client.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const file = fs.readFileSync(join(__dirname, '../tmp/test.txt'));
  const fileBase64 = file.toString('base64');

  const create = await client.datasets.documents.create({
    dataset_id: datasetId,
    document_bases: [
      {
        name: 'test.txt',
        source_info: {
          file_base64: fileBase64,
          file_type: 'txt',
        },
      },
    ],
    chunk_strategy: {
      chunk_type: 0,
    },
  });
  console.log('client.datasets.documents.create', create);

  const update = await client.datasets.documents.update({
    document_id: create[0].document_id,
    document_name: 'test2.txt',
  });
  console.log('client.datasets.documents.update', update);

  await client.datasets.documents.delete({
    document_ids: [create[0].document_id],
  });

  const list = await client.datasets.documents.list({
    dataset_id: datasetId,
    page: 1,
    page_size: 10,
  });
  console.log('client.datasets.documents.list', list);
}

main().catch(console.error);