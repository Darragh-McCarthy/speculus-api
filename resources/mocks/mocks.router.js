const { Router } = require("express");
const { PredictionModel } = require("../../models/prediction.model");
const { makePrediction } = require("../predictions/predictions.service");
const { UserModel } = require("../../models/user.model");
const { TopicModel } = require("../../models/topic.model");
const { CommentModel } = require("../../models/comment.model");
const { addComment } = require("../comments/comments.service");
const { NotificationModel } = require("../../models/notification.model");

const faker = require("faker");

const mocksRouter = new Router();

const clearMockData = async () => {
  await CommentModel.deleteMany({});
  await TopicModel.deleteMany({});
  await PredictionModel.deleteMany({});
  await UserModel.deleteMany({});
  await NotificationModel.deleteMany({});
};

const myFacebookUser = {
  id: "10219643547749078",
  email: "darraghjames@gmail.com",
  name: "Darragh McCarthy"
};
const mockFacebookUsers = [
  {
    id: "100041542292052",
    email: "geqqupgrip_1568142314@tfbnw.net",
    name: "Margaret Aldaedbbibjeb Bushakberg"
  },
  {
    id: "100041287545389",
    email: "zsxlsqggvr_1568142332@tfbnw.net",
    name: "Dave Aldabhgedechi Bushakwitz"
  },
  {
    id: "100041271435691",
    email: "uayvrtoapq_1568142326@tfbnw.net",
    name: "Abigail Aldabgadcefia Wongstein"
  },
  {
    id: "100041134493789",
    email: "csgberaqlt_1568142321@tfbnw.net",
    name: "Harry Aldaacddicghi Fallerberg"
  }
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
    mockFacebookUsers.map(e =>
      UserModel.create({
        facebook: {
          email: e.email,
          name: e.name,
          id: e.id
        }
      })
    )
  );

  await UserModel.create({
    facebook: {
      id: myFacebookUser.id,
      email: myFacebookUser.email,
      name: myFacebookUser.name
    }
  });

  // create topics
  await Promise.all(
    mockPredictions
      .map(e => e.topics)
      .reduce((a, b) => {
        b.forEach(eachTopic => {
          if (!a.find(e => e === eachTopic)) {
            a.push(eachTopic);
          }
        });
        return a;
      }, [])
      .map(e =>
        TopicModel.create({
          author: users[Math.floor(Math.random() * users.length)],
          title: e.trim(),
          titleLowerCase: e.trim().toLowerCase(),
          pendingEditorialReview: false,
          includeInDirectory: true
        })
      )
  );

  mockPredictions.forEach(eachPrediction => {
    eachPrediction.topics = eachPrediction.topics.map(eachTopic => {
      return {
        addedBy: users[Math.floor(Math.random() * users.length)],
        title: eachTopic
      };
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
        avatarUrl: author.clientSideObject.avatarUrl,
        name: author.facebook.name
      }
    );
    const comments = mockComments.slice(
      0,
      Math.floor(Math.random() * mockComments.length)
    );
    for (let eachComment of comments) {
      const author = users[Math.floor(Math.random() * users.length)];
      console.log("author.clientSideObject");
      console.log(author.clientSideObject);
      console.log("author.clientSideObject");
      console.log(" ");
      await addComment(
        {
          predictionId: prediction._id,
          text: eachComment,
          sevenStarLikelihood: Math.ceil(Math.random() * 7)
        },
        {
          id: author._id,
          avatarUrl: author.clientSideObject.avatarUrl,
          name: author.facebook.name
        }
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
