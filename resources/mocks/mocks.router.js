const { Router } = require("express");
const { PredictionModel } = require("../predictions/prediction.model");
const { makePrediction } = require("../predictions/predictions.service");
const { UserModel } = require("../users/user.model");
const { TopicModel } = require("../topics/topic.model");
const { RatingModel } = require("../ratings/rating.model");
const { CommentModel } = require("../comments/comment.model");
const { addComment } = require("../comments/comments.service");
const { NotificationModel } = require("../notifications/notification.model");

const faker = require("faker");

const mocksRouter = new Router();

const clearMockData = async () => {
  await CommentModel.deleteMany({});
  await RatingModel.deleteMany({});
  await TopicModel.deleteMany({});
  await PredictionModel.deleteMany({});
  await UserModel.deleteMany({});
  await NotificationModel.deleteMany({});
};

const mockUserData = [
  { email: "johndoe@gmail.com", fullName: "John Doe" },
  { email: "emily@gmail.com", fullName: "Emily Crowley" },
  { email: "arnold@gmail.com", fullName: "Arnold Swartzeneiger" },
  { email: "philip@gmail.com", fullName: "Philip Sweet" }
];

const mockComments = [
  `One of the most interesting things about an M&A merger is that very often the name that the combined company keeps afterward is the one whose management team ‘lost’ the negotiations. They have the ‘brand’ that has value, so it’s very often the other side that has the ‘management’.`,
  `It’s a real high wire act - running a bank of that size. I know many people who have been close to it, the highest profile name being Blythe Masters who was for a time CFO of JPMorgan Bank, but is better known as head of Commodity and Currency Trading. Blythe is without a doubt one of the most competent people I’ve ever met in Banking. But though I’ve never met Jamie Dimon, I would have to assume he’s even more skilled than that.`,
  `There are few CEO’s who have demonstrated a greater competence at running a bank than Jamie Dimon. He became the CEO of JPMorgan after a merger with Bank One. The details of that negotiation are private but the ‘insider’ talk I’ve heard over the years gives me the impression that the model for the decisions was as I just laid out. Regardless of the original why, since that time he’s more than demonstrated his extreme competence.`,
  `And in terms of specific technologies, right now in demand are Apache Spark, Apache Airflow, Kubernetes, Docker, for platforms mainly AWS, GCP and Azure. For languages normally python and/or scala. Also for data streaming often is used Kafka and the most popular alternatives of it.`,
  `While there is such a thing as a pro-active person, I don’t know that there is such a thing as ‘predictive’ person, with the qualification that thoughtful and intelligent people tend to be predictive, though they do not tend to be particularly proactive, since their predictiveness becomes an end-unto-itself.`
];

mocksRouter.get("/populate", async (req, res) => {
  await clearMockData();
  const mockPredictions = JSON.parse(JSON.stringify(require("./mocks.json")))
    .data; //.slice(0, 3);

  const users = await Promise.all(
    mockUserData.map(e =>
      UserModel.create({
        email: { primary: e.email },
        fullName: e.fullName,
        avatarUrl: faker.image.avatar()
      })
    )
  );

  await UserModel.create({
    email: { primary: "darraghjames@gmail.com" },
    fullName: "Darragh McCarthy",
    avatarUrl: faker.image.avatar()
  });

  // create topics
  await Promise.all(
    mockPredictions
      .map(e => e.topics)
      .reduce((a, b) => {
        b.forEach(eachTopic => {
          if (!a.find(e => e.title === eachTopic.title)) {
            a.push(eachTopic);
          }
        });
        return a;
      }, [])
      .map(e =>
        TopicModel.create({
          author: users[Math.floor(Math.random() * users.length)],
          title: e.title.trim(),
          titleLowerCase: e.title.trim().toLowerCase(),
          pendingEditorialReview: false,
          includeInDirectory: true
        })
      )
  );

  mockPredictions.forEach(eachPrediction => {
    eachPrediction.topics.forEach(eachTopic => {
      eachTopic.addedBy = users[Math.floor(Math.random() * users.length)];
    });
  });

  for (let mockPrediction of mockPredictions) {
    const author = users[Math.floor(Math.random() * users.length)];
    const { prediction } = await makePrediction(
      {
        topics: mockPrediction.topics,
        title: mockPrediction.title
      },
      {
        userId: author,
        avatarUrl: author.avatarUrl,
        fullName: author.fullName
      }
    );
    const comments = mockComments.slice(
      0,
      Math.floor(Math.random() * mockComments.length)
    );
    for (let eachComment of comments) {
      const author = users[Math.floor(Math.random() * users.length)];
      await addComment(
        prediction._id,
        eachComment,
        author._id,
        author.avatarUrl,
        author.fullName,
        Math.ceil(Math.random() * 7)
      );
    }
  }

  return res.json({});
});

mocksRouter.get("/clear", async (req, res) => {
  await clearMockData();
  return res.json({});
});
mocksRouter.get("/users", async (req, res) => {
  const users = await UserModel.find({});
  return res.json({ data: users });
});

module.exports = {
  mocksRouter
};
