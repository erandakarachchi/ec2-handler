"use strict";

const EC2Handler = require("./lib/ec2-handler");

module.exports.listAllEC2Instances = async event => {
  try {
    const instances = await EC2Handler.listAllEC2Instances();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Fetched Data Of EC2 Instances",
          instances
        },
        null,
        2
      )
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Internal Server Error"
        },
        null,
        2
      )
    };
  }
};

module.exports.createEC2Instance = async event => {
  try {
    const eventBody = JSON.parse(event.body);
    const params = {
      ImageId: eventBody.ImageId,
      InstanceType: eventBody.InstanceType,
      KeyName: eventBody.KeyName,
      MinCount: 1,
      MaxCount: 1
    };
    const instanceName = eventBody.InstanceName;
    console.log("PARAMS : ", params);

    const result = await EC2Handler.createEC2Instance(instanceName, params);
    if (result) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: "Created a New EC2 Instances"
          },
          null,
          2
        )
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Failed to create EC2 Instance"
        },
        null,
        2
      )
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Internal Server Error"
        },
        null,
        2
      )
    };
  }
};
