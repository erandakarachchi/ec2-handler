var AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });
const AWS_API_VERSION = { apiVersion: "2016-11-15" };

const EC2Handler = {
  listAllEC2Instances: async () => {
    try {
      const ec2 = new AWS.EC2(AWS_API_VERSION);
      const ec2data = await ec2.describeInstances({}).promise();
      let instanceData = [];
      if (ec2data.Reservations) {
        instanceData = ec2data.Reservations.map(instance => {
          return {
            OwnerId: instance.OwnerId,
            ReservationId: instance.ReservationId,
            Instances: {
              Tags: instance.Instances[0].Tags,
              ImageId: instance.Instances[0].ImageId,
              InstanceType: instance.Instances[0].InstanceType,
              KeyName: instance.Instances[0].KeyName,
              PublicIpAddress: instance.Instances[0].PublicIpAddress,
              State: instance.Instances[0].State
            }
          };
        });
      }
      return instanceData;
    } catch (error) {
      console.log(error);
      throw new Error("Cannot list EC2 instances");
    }
  },

  createEC2Instance: async (instanceName, params) => {
    try {
      const ec2 = new AWS.EC2(AWS_API_VERSION);

      const instanceParams = { ...params };
      const ec2Instance = await ec2.runInstances(instanceParams).promise();
 
      const instanceId = ec2Instance.Instances[0].InstanceId;
      const tagParams = {
        Resources: [instanceId],
        Tags: [
          {
            Key: "Name",
            Value: instanceName
          }
        ]
      };

      await new AWS.EC2(AWS_API_VERSION).createTags(tagParams).promise();

      return true;
    } catch (error) {
      console.log("Error : ", error);
      throw new Error("Cannot run EC2 instance.");
    }
  },
  terminateEC2Instance: async () => {}
};

module.exports = EC2Handler;
