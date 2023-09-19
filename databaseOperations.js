// const fs = require('fs');
// const xml2js = require('xml2js');
// const { Client } = require('pg');
// const pgp = require('pg-promise')();
// const sax = require('sax');

// ========================FETCHING & CONVERTING DATA============================

// For converting XML Data to JSON
// async function xmlToJson(file) {
//   const xmlData = await fs.promises.readFile(
//     `/home/infinite/Downloads/Arduino Data/${file}.xml`,
//     'utf-8',
//   );

//   const jsonData = await xml2js.parseStringPromise(xmlData);

//   const category = file.toLowerCase();
//   const cleanData = jsonData[category]['row'].map((data) => {
//     return data['$'];
//   });
//   return cleanData;
// }

// For reading the directory and getting the filenames:
// async function getTheListOfFiles() {
//   const fileNames = await fs.promises.readdir(
//     '/home/infinite/Downloads/Arduino Data',
//   );
//   return fileNames;
// }

// ==================================DATABASE OPERATIONS=========================
// async function insertTagsData(dataList) {
//   try {
//     // Configure the PostgreSQL connection
//     const dbConfig = {
//       user: 'postgres',
//       host: '127.0.0.1',
//       database: 'stackexchange',
//       password: 'mountblue@123',
//       port: 5432, // The default PostgreSQL port
//     };

//     // Create a new database connection
//     const db = pgp(dbConfig);
//     // Start a transaction
//     await db.tx(async (t) => {
//       // Loop through the data and insert it into the database
//       for (const data of dataList) {
//         // Parse values, replacing NaN with null
//         const id = isNaN(parseInt(data.Id)) ? null : parseInt(data.Id);
//         const count = isNaN(parseInt(data.Count)) ? null : parseInt(data.Count);
//         const excerptPostId = isNaN(parseInt(data.ExcerptPostId))
//           ? null
//           : parseInt(data.ExcerptPostId);
//         const wikiPostId = isNaN(parseInt(data.WikiPostId))
//           ? null
//           : parseInt(data.WikiPostId);

//         await t.none(
//           `
//           INSERT INTO tags (Id, TagName, Count, ExcerptPostId, WikiPostId)
//           VALUES ($1, $2, $3, $4, $5)
//         `,
//           [id, data.TagName, count, excerptPostId, wikiPostId],
//         );
//       }
//     });

//     console.log('Data inserted successfully.');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   } finally {
//     // Close the database connection
//     pgp.end();
//   }
// }

// async function insertUserData(dataList) {
//   try {
//     // Configure the PostgreSQL connection
//     const dbConfig = {
//       user: 'postgres',
//       host: '127.0.0.1',
//       database: 'stackexchange',
//       password: 'mountblue@123',
//       port: 5432, // The default PostgreSQL port
//     };

//     // Create a new database connection
//     const db = pgp(dbConfig);
//     // Start a transaction
//     await db.tx(async (t) => {
//       // Loop through the data and insert it into the database
//       for (const data of dataList) {
//         // Parse values, replacing NaN with null
//         const id = isNaN(parseInt(data.Id)) ? null : parseInt(data.Id);
//         const reputation = isNaN(parseInt(data.Reputation))
//           ? null
//           : parseInt(data.Reputation);
//         const creationDate = new Date(data.CreationDate);
//         const displayName = data.DisplayName;
//         const lastAccessDate = new Date(data.LastAccessDate);
//         const location = data.Location || null;
//         const aboutMe = data.AboutMe || null;
//         const views = isNaN(parseInt(data.Views)) ? null : parseInt(data.Views);
//         const upVotes = isNaN(parseInt(data.UpVotes))
//           ? null
//           : parseInt(data.UpVotes);
//         const downVotes = isNaN(parseInt(data.DownVotes))
//           ? null
//           : parseInt(data.DownVotes);
//         const accountId = isNaN(parseInt(data.AccountId))
//           ? null
//           : parseInt(data.AccountId);

//         await t.none(
//           `
//           INSERT INTO Users (
//             Id, Reputation, CreationDate, DisplayName, LastAccessDate, Location, AboutMe, Views, UpVotes, DownVotes, AccountId
//           )
//           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//         `,
//           [
//             id,
//             reputation,
//             creationDate,
//             displayName,
//             lastAccessDate,
//             location,
//             aboutMe,
//             views,
//             upVotes,
//             downVotes,
//             accountId,
//           ],
//         );
//       }
//     });

//     console.log('User data inserted successfully.');
//   } catch (error) {
//     console.error('Error inserting user data:', error);
//   } finally {
//     // Close the database connection
//     pgp.end();
//   }
// }

// function parseTimestamp(timestamp) {
//   try {
//     const date = new Date(timestamp);
//     // Check if the parsed date is valid
//     if (!isNaN(date.getTime())) {
//       return date;
//     }
//   } catch (error) {
//     // Handle the error or return null, depending on your use case
//   }
//   return null;
// }

// async function insertPostsData(dataList) {
//   try {
//     // Configure the PostgreSQL connection
//     const dbConfig = {
//       user: 'postgres',
//       host: '127.0.0.1',
//       database: 'stackexchange',
//       password: 'mountblue@123',
//       port: 5432, // The default PostgreSQL port
//     };

//     // Create a new database connection
//     const db = pgp(dbConfig);
//     // Create a new transaction
//     // Start a single transaction for all inserts
//     await db.tx(async (t) => {
//       for (let data of dataList) {
//         // Parse values, replacing NaN with null
//         const id = isNaN(parseInt(data.Id)) ? null : parseInt(data.Id);
//         const postTypeId = isNaN(parseInt(data.PostTypeId))
//           ? null
//           : parseInt(data.PostTypeId);
//         const parentId = isNaN(parseInt(data.ParentId))
//           ? null
//           : parseInt(data.ParentId);
//         const creationDate = parseTimestamp(data.CreationDate);
//         const score = isNaN(parseInt(data.Score)) ? null : parseInt(data.Score);
//         const body = data.Body;
//         const ownerUserId = isNaN(parseInt(data.OwnerUserId))
//           ? null
//           : parseInt(data.OwnerUserId);
//         const lastEditorUserId = isNaN(parseInt(data.LastEditorUserId))
//           ? null
//           : parseInt(data.LastEditorUserId);
//         const lastEditDate = parseTimestamp(data.LastEditDate);
//         const lastActivityDate = new Date(data.LastActivityDate);
//         const commentCount = isNaN(parseInt(data.CommentCount))
//           ? null
//           : parseInt(data.CommentCount);
//         const contentLicense = data.ContentLicense;

//         // Insert the data into the database
//         await t.none(
//           `
//           INSERT INTO Posts (
//             Id, PostTypeId, ParentId, CreationDate, Score, Body, OwnerUserId,
//             LastEditorUserId, LastEditDate, LastActivityDate, CommentCount, ContentLicense
//           )
//           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
//         `,
//           [
//             id,
//             postTypeId,
//             parentId,
//             creationDate,
//             score,
//             body,
//             ownerUserId,
//             lastEditorUserId,
//             lastEditDate,
//             lastActivityDate,
//             commentCount,
//             contentLicense,
//           ],
//         );
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   } finally {
//     // Close the database connection
//     pgp.end();
//   }
// }

// async function insertVotesData(dataList) {
//   try {
//     // Configure the PostgreSQL connection
//     const dbConfig = {
//       user: 'postgres',
//       host: '127.0.0.1',
//       database: 'stackexchange',
//       password: 'mountblue@123',
//       port: 5432, // The default PostgreSQL port
//     };

//     // Create a new database connection
//     const db = pgp(dbConfig);
//     await db.tx(async (t) => {
//       for (let data of dataList) {
//         // Parse values, replacing NaN with null
//         const id = isNaN(parseInt(data.Id)) ? null : parseInt(data.Id);
//         const postId = isNaN(parseInt(data.PostId))
//           ? null
//           : parseInt(data.PostId);
//         const voteTypeId = isNaN(parseInt(data.VoteTypeId))
//           ? null
//           : parseInt(data.VoteTypeId);
//         const creationDate = parseTimestamp(data.CreationDate);

//         // Insert the data into the Votes table
//         await t.none(
//           `
//           INSERT INTO Votes (Id, PostId, VoteTypeId, CreationDate)
//           VALUES ($1, $2, $3, $4)
//         `,
//           [id, postId, voteTypeId, creationDate],
//         );
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   } finally {
//     pgp.end();
//   }
// }

// async function insertPostHistoryData(dataList) {
//   try {
//     // Configure the PostgreSQL connection
//     const dbConfig = {
//       user: 'postgres',
//       host: '127.0.0.1',
//       database: 'stackexchange',
//       password: 'mountblue@123',
//       port: 5432, // The default PostgreSQL port
//     };

//     // Create a new database connection
//     const db = pgp(dbConfig);
//     await db.tx(async (t) => {
//       for (let data of dataList) {
//         // Parse values, replacing NaN with null
//         const id = isNaN(parseInt(data.Id)) ? null : parseInt(data.Id);
//         const postId = isNaN(parseInt(data.PostId))
//           ? null
//           : parseInt(data.PostId);
//         const voteTypeId = isNaN(parseInt(data.VoteTypeId))
//           ? null
//           : parseInt(data.VoteTypeId);
//         const creationDate = parseTimestamp(data.CreationDate);

//         // Insert the data into the Votes table
//         await t.none(
//           `
//           INSERT INTO Votes (Id, PostId, VoteTypeId, CreationDate)
//           VALUES ($1, $2, $3, $4)
//         `,
//           [id, postId, voteTypeId, creationDate],
//         );
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   } finally {
//     pgp.end();
//   }
// }

// async function readPostHisory() {
//   const { Pool } = require('pg');

//   // Create a PostgreSQL pool to manage database connections
//   const dbConfig = {
//     user: 'postgres',
//     host: '127.0.0.1',
//     database: 'stackexchange',
//     password: 'mountblue@123',
//     port: 5432,
//   };

//   const pool = new Pool(dbConfig);

//   // Create a new SAX parser
//   const parser = sax.createStream(true, { trim: true, normalize: true });

//   // Initialize variables to hold parsed data
//   let currentData = {};

//   // Handle XML element opening tags
//   parser.on('opentag', (node) => {
//     // Process XML element opening tags here
//     if (node.name === 'row') {
//       currentData = { ...node.attributes };
//     }
//   });

//   // Handle XML element closing tags
//   parser.on('closetag', (nodeName) => {
//     // Process XML element closing tags here
//     if (nodeName === 'row') {
//       // Insert the data into the PostHistory table
//       const insertQuery = `
//       INSERT INTO PostHistory (
//         Id, PostHistoryTypeId, PostId, RevisionGUID, CreationDate, UserId, Text, ContentLicense, ElementName
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//     `;

//       const values = [
//         currentData.Id,
//         currentData.PostHistoryTypeId,
//         currentData.PostId,
//         currentData.RevisionGUID,
//         new Date(currentData.CreationDate),
//         currentData.UserId,
//         currentData.Text,
//         currentData.ContentLicense,
//         currentData.elementName,
//       ];

//       pool.query(insertQuery, values, (err, res) => {
//         if (err) {
//           console.error('Error inserting data:', err);
//         } else {
//           console.log('Data inserted successfully:', res);
//         }
//       });
//     }
//   });

//   // Handle errors
//   parser.on('error', (error) => {
//     console.error('XML Parsing Error:', error);
//   });

//   // Create a read stream for your XML file
//   const xmlFileStream = fs.createReadStream(
//     '/home/infinite/Downloads/Arduino Data/PostHistory.xml',
//     {
//       encoding: 'utf8',
//     },
//   );

//   // Pipe the XML data stream to the parser
//   xmlFileStream.pipe(parser);

//   // Listen for the 'end' event when the entire XML file has been processed
//   xmlFileStream.on('end', () => {
//     console.log('XML Parsing Complete');
//   });
// }
// async function readVotesData() {
//   let data = await xmlToJson('Votes');
//   console.log(data);
// }
