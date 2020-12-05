import fs from 'fs';
import fetch from 'node-fetch';

const chunkToEntry = (chunk) => {
  const [number, title, date, summary] = chunk.split('\n');

  // Trim commas off of date line
  const commaIndex = date.indexOf(',');
  const startDate = date.slice(0, commaIndex !== -1 ? commaIndex : date.length);

  // Parse the date and format as YYYY-MM-DD
  const parsedStartDate = new Date(startDate);
  const isoDate = parsedStartDate.toISOString().slice(0, 10);

  // Return fields in format for posting to Contentful
  return {
    fields: {
      number: {
        'en-US': number.trim(),
      },
      title: {
        'en-US': title.trim(),
      },
      date: {
        'en-US': isoDate,
      },
      summary: {
        'en-US': summary.trim(),
      },
    },
  };
};

const logSuccess = (message) => {
  console.log(`\x1b[32m${message}\x1b[0m`);
};

const logError = (message) => {
  console.error(`\x1b[31m${message}\x1b[0m`);
};

const createEntry = async (entry) => {
  const createResponse = await fetch(
    'https://api.contentful.com/spaces/nvfmgez7z8dl/environments/master/entries',
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': 'mission',
      },
      body: JSON.stringify(entry),
    },
  );

  const createResponseBody = await createResponse.json();

  if (createResponse.status !== 201) {
    logError(
      `Failed to create entry ${
        entry.fields.number['en-US']
      }:\n\n${JSON.stringify(createResponseBody, null, '  ')} `,
    );
    process.exit(1);
  }

  logSuccess(`Created entry ${entry.fields.number['en-US']}`);

  const entryId = createResponseBody.sys.id;
  const version = createResponseBody.sys.version;

  const publishResponse = await fetch(
    `https://api.contentful.com/spaces/nvfmgez7z8dl/environments/master/entries/${entryId}/published`,
    {
      method: 'put',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
        'X-Contentful-Version': version,
      },
    },
  );

  const publishResponseBody = await publishResponse.json();

  if (publishResponse.status !== 200) {
    logError(
      `Failed to publish entry ${
        entry.fields.number['en-US']
      }:\n\n${JSON.stringify(publishResponseBody, null, '  ')}`,
    );
    process.exit(1);
  }

  logSuccess(`Published entry ${entry.fields.number['en-US']}`);
};

(async () => {
  const file = fs.readFileSync(process.argv[2], 'utf-8');
  const chunks = file.split('\n\n');

  const entries = chunks.map((chunk) => {
    try {
      return chunkToEntry(chunk);
    } catch (e) {
      logError(`Failed to parse chunk: ${e.message}\n\nChunk:\n\n${chunk}\n\n`);
      process.exit(1);
    }
  });

  for (const entry of entries) {
    await createEntry(entry);
  }
})();
