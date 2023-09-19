async function runQuery(query) {
  try {
    const { Client } = require('pg');
    const client = new Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'stackexchange',
      password: 'mountblue@123',
      port: 5432,
    });
    await client.connect();
    const response = await client.query(`${query}`);
    console.log(response['rows']);
    client.end();
  } catch (error) {
    console.log(error);
  }
}

const p1 = `What is the percentage of posts that have at least one answer?`;
const query1 = `SELECT (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM posts)) AS percentage_answered
FROM posts
WHERE answercount > 0 `;

const p2 = 'List the top 10 users who have the most reputation:';
const query2 = `select id, reputation, displayname from users
order by reputation desc
limit 10`;

const p3 = 'Which day of the week has most questions answered within an hour?:';

const query3 = `select CASE
WHEN EXTRACT(DOW FROM quesans.a_date) = 0 THEN 'Sunday'
WHEN EXTRACT(DOW FROM quesans.a_date) = 1 THEN 'Monday'
WHEN EXTRACT(DOW FROM quesans.a_date) = 2 THEN 'Tuesday'
WHEN EXTRACT(DOW FROM quesans.a_date) = 3 THEN 'Wednesday'
WHEN EXTRACT(DOW FROM quesans.a_date) = 4 THEN 'Thursday'
WHEN EXTRACT(DOW FROM quesans.a_date) = 5 THEN 'Friday'
WHEN EXTRACT(DOW FROM quesans.a_date) = 6 THEN 'Saturday'
END AS day_of_week,
COUNT(*) AS count_of_entries
from
((select posts.id as q_id, posts.creationdate as q_date
from posts 
where posts.posttypeid = 1)as questions
inner join 
(select posts.id as a_id, posts.creationdate as a_date, posts.ParentId as p_id
from posts 
where posts.posttypeid = 2)as answers
on questions.q_id = answers.p_id) as quesans
where (EXTRACT(EPOCH FROM (quesans.a_date - quesans.q_date)) / 3600 < 1) and 
DATE(quesans.a_date) = DATE(quesans.q_date)
GROUP BY day_of_week
order by count_of_entries desc 
limit 1`;

const p4 = 'Find the top 10 posts with the most upvotes in 2015?';
const query4 = `SELECT id,creationdate,upvotes FROM posts
INNER JOIN (
SELECT postid,COUNT(*) as upvotes FROM VOTES
    WHERE votetypeid = 2
    GROUP BY postid
) AS votes
ON  posts.id = votes.postid
WHERE EXTRACT(YEAR FROM posts.creationdate) = 2015
ORDER BY upvotes DESC
LIMIT 10; `;

const p5 = 'Find the top 5 tags associated with the most number of posts:';
const query5 = `select tags,count(*) as tag_count
from posts
where tags is not null
group by tags
order by tag_count desc
limit 10`;

const p6 = 'Find the number of questions asked every year:';
const query6 = `select extract(year from creationdate) as year, count(*) as questions_asked
from posts
where posttypeid = 1
group by year
order by year`;

const p7 = `For the questions asked in 2014, find any 3 "rare" questions that are associated with the least used tags`;
const query7 = `select posts.id as question_id, posts.title as question, posts.tags as least_used_tags
from
(select tagname 
from tags 
order by count 
limit 10) as least_used_tags
inner join posts
on posts.tags like concat('%',least_used_tags.tagname,'%')
where posts.posttypeid = 1 and extract(year from posts.creationdate ) = 2014
`;

const p8 = `When did arduino.stackexchange.com have the most usage? Has it declined in usage now? (somewhat open-ended question. Use your own interpretation of the question)`;
const query8 = `SELECT EXTRACT(YEAR FROM creationdate) as year ,  SUM(answercount+viewcount+commentcount) AS user_activity, count(*) as total_posts
FROM posts
GROUP  BY year
ORDER BY user_activity DESC;`;

const p9 = `Find the top 5 users who have performed the most number of actions in terms of creating posts, comments, votes:`;
const query9 = `select userpost.user_id, sum(userpost.Total_Votes+userpost.total_posts+usercomments.comment_points) as total_points
from 
(select comments.userid, count(comments.id)*3 as comment_points
from comments
group by comments.userid) as usercomments
inner join
(select users.id as user_id, 
sum(users.upvotes + users.downvotes)as Total_Votes,
count(posts.id)*10 as total_posts
from users inner join posts
on users.id = posts.owneruserid
group by users.id ) as userpost
on userpost.user_id = usercomments.userid
group by userpost.user_id
order by total_points desc
limit 5
`;

async function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

async function main() {
  console.log(p1);
  await runQuery(query1);
  await delay();

  console.log(p2);
  await runQuery(query2);
  await delay();

  console.log(p3);
  await runQuery(query3);
  await delay();

  console.log(p4);
  await runQuery(query4);
  await delay();

  console.log(p5);
  await runQuery(query5);
  await delay();

  console.log(p6);
  await runQuery(query6);
  await delay();

  console.log(p7);
  await runQuery(query7);
  await delay();

  console.log(p8);
  await runQuery(query8);
  await delay();

  console.log(p9);
  await runQuery(query9);
}

main();
