const { Router } = require("express");
const { PredictionModel } = require("../predictions/prediction.model");
const { UserModel } = require("../users/user.model");
const { TopicModel } = require("../topics/topic.model");
const faker = require("faker");

const mocksRouter = new Router();

const clearMockData = async () => {
  await TopicModel.deleteMany();
  await PredictionModel.deleteMany();
  await UserModel.deleteMany({});
};

const mockUserData = [
  { email: "darraghjames@gmail.com", fullName: "Darragh McCarthy" },
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
  const predictionsResponse = JSON.parse(
    JSON.stringify(require("./mocks.json"))
  );
  const users = await Promise.all(
    mockUserData.map(e =>
      UserModel.create({
        email: { primary: e.email },
        fullName: e.fullName,
        avatarUrl: faker.image.avatar()
      })
    )
  );

  await Promise.all(
    predictionsResponse.data
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
          pendingEditorialReview: false
        })
      )
  );

  predictionsResponse.data.forEach(eachPrediction => {
    eachPrediction.topics.forEach(eachTopic => {
      eachTopic.addedBy = users[Math.floor(Math.random() * users.length)];
    });
  });

  predictionsResponse.data.forEach(eachPrediction => {
    eachPrediction.comments = mockComments
      .slice(0, Math.floor(Math.random() * mockComments.length))
      .map(title => {
        const author = users[Math.floor(Math.random() * users.length)];
        return {
          text: title,
          author: {
            id: author._id,
            avatarUrl: author.avatarUrl,
            fullName: author.fullName
          }
        };
      });
  });

  predictionsResponse.data.forEach(e => {
    e.author = users[Math.floor(Math.random() * users.length)];
  });

  function generateMockRatings() {
    const usersCopy = users.slice();
    return new Array(Math.floor(Math.random() * 5))
      .fill(0)
      .map(() => {
        const i = Math.floor(Math.random() * usersCopy.length);
        const author = usersCopy.splice(i, 1)[0];

        let authorData;
        if (author) {
          authorData = {
            id: author && author.id,
            avatarUrl: author && author.avatarUrl,
            fullName: author && author.fullName
          };
        }

        return {
          rating: Math.ceil(Math.random() * 7),
          author: authorData
        };
      })
      .filter(e => e.author);
  }

  predictionsResponse.data.forEach(e => {
    const ratings = generateMockRatings();
    e.sevenPointLikelihoodRatings = ratings;
  });

  await PredictionModel.create(predictionsResponse.data);
  await PredictionModel.find({});
  return res.json({});
});

mocksRouter.get("/clear", async (req, res) => {
  await clearMockData();
  return res.json({});
});

module.exports = {
  mocksRouter
};
