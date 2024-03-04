import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, ic } from "azle";
import express from "express";
import cors from "cors";
import { hexAddressFromPrincipal } from "azle/canisters/ledger";

/**
 * This type represents a product that can be listed on a marketplace.
 * It contains basic properties that are needed to define a product.
 */

// Define the Room type
class Room {
  id: string; // Unique identifier for the room
  title: string; // Title of the room
  description: string; // Description of the room
  avatar: string; // URL of the room's avatar image
  owner: string; // Owner of the room
  members: string[]; // Array of room members
  createdAt: Date; // Timestamp of when the room was created
  updatedAt: Date; // Optional timestamp of when the room was last updated
}

// Define the RoomPayload type for creating and updating rooms
class RoomPayload {
  title: string; // Title of the room
  description: string; // Description of the room
  avatar: string; // URL of the room's avatar image
}

// Define the Message type
class Message {
  id: string; // Unique identifier for the message
  message: string; // Content of the message
  sender: string; // Sender of the message
  roomId: string; // ID of the room to which the message belongs
  createdAt: Date; // Timestamp of when the message was sent
}

// Define the MessagePayload type for sending messages
class MessagePayload {
  message: string; // Content of the message
}

// Create a new StableBTreeMap to store rooms and messages

/**
 * `productsStorage` - it's a key-value data structure that is used to store products.
 * {@link StableBTreeMap} is a self-balancing tree that acts as durable data storage that keeps data across canister upgrades.
 * For the sake of this contract we've chosen {@link StableBTreeMap} as a storage for the next reasons:
 * - `insert`, `get` and `remove` operations have a constant time complexity - O(1)
 * - data stored in the map survives canister upgrades unlike using HashMap where data is stored in a heap and it's lost after the canister is upgraded
 *
 * Breakdown of the `StableBTreeMap(string, Message)` datastructure:
 * - the key of the map is a `messageId`
 * - the value in this map is a message itself `Message` that is related to a given key (`messageId`)
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map.
 */
const roomStorage = StableBTreeMap<string, Room>(0);
const messageStorage = StableBTreeMap<string, Message>(1);

export default Server(() => {
  const app = express();
  // only for development purposes. For production-ready apps, one must configure CORS appropriately
  app.use(cors());
  app.use(express.json());

  app.get("/rooms", (req, res) => {
    const rooms = roomStorage.values();
    const returnedRooms: Room[] = [];

    for (const room of rooms) {
      if (room.members.map(String).includes(ic.caller().toString())) {
        returnedRooms.push(room);
      }
    }

    res.json(returnedRooms);
  });

  app.get("/rooms/:id", (req, res) => {
    const { id: roomId } = req.params;
    const productOpt = roomStorage.get(roomId);
    if ("None" in productOpt) {
      res.status(404).send(`the product with id=${roomId} not found`);
    } else {
      res.json(productOpt.Some);
    }
  });

  app.post("/rooms", (req, res) => {
    const payload = req.body as RoomPayload;
    const room = {
      id: uuidv4(),
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
      owner: ic.caller().toText(),
      members: [ic.caller().toText()],
      ...payload,
    };

    roomStorage.insert(room.id, room);
    return res.json(room);
  });

  app.put("/rooms/:id", (req, res) => {
    const roomId = req.params.id;
    const payload = req.body as RoomPayload;
    const roomOpt = roomStorage.get(roomId);
    if ("None" in roomOpt) {
      res
        .status(400)
        .send(`couldn't update a room with id=${roomId}. room not found`);
    } else {
      const room = roomOpt.Some;
      if (ic.caller().toString() !== room.owner) {
        res
          .status(400)
          .send(`couldn't update a room with id=${roomId}. not authorized`);
      }

      const updatedRoom = {
        ...room,
        ...payload,
        updatedAt: getCurrentDate(),
      };
      roomStorage.insert(room.id, updatedRoom);
      res.json(updatedRoom);
    }
  });

  app.post("/rooms/:id/add", (req, res) => {
    const roomId = req.params.id;
    const { member } = req.body;
    const roomOpt = roomStorage.get(roomId);
    if ("None" in roomOpt) {
      res
        .status(400)
        .send(`couldn't add member to room with id=${roomId}. room not found`);
    } else {
      const room = roomOpt.Some;
      if (ic.caller().toString() !== room.owner) {
        res
          .status(400)
          .send(
            `couldn't add member to room with id=${roomId}. not authorized`
          );
      }

      room.members.push(member); // Add the member to the room's members array
      roomStorage.insert(room.id, room);
      res.json(room);
    }
  });

  app.post("/rooms/:id/message", (req, res) => {
    const roomId = req.params.id;
    const payload = req.body as MessagePayload;
    const roomOpt = roomStorage.get(roomId);
    if ("None" in roomOpt) {
      res
        .status(400)
        .send(
          `couldn't send message to room with id=${roomId}. room not found`
        );
    } else {
      const room = roomOpt.Some;
      const isMember = room.members.includes(ic.caller().toString());
      if (!isMember) {
        res
          .status(400)
          .send(
            `couldn't send message to room with id=${roomId}. not authorized`
          );
      }

      const message = {
        id: uuidv4(),
        createdAt: getCurrentDate(),
        sender: ic.caller().toText(),
        roomId: roomId,
        ...payload,
      };
      messageStorage.insert(message.id, message);
      res.json(message);
    }
  });

  app.delete("/rooms/:id", (req, res) => {
    const roomId = req.params.id;
    const roomOpt = roomStorage.get(roomId);

    if ("None" in roomOpt) {
      res
        .status(400)
        .send(`couldn't delete a room with id=${roomId}. room not found`);
    } else {
      const room = roomOpt.Some;
      if (ic.caller().toString() !== room.owner) {
        res
          .status(400)
          .send(`couldn't update a room with id=${roomId}. not authorized`);
      }
      const deletedRoomOpt = roomStorage.remove(roomId);
      res.json(deletedRoomOpt.Some);
    }
  });

  app.get("/rooms/:id/messages", (req, res) => {
    const roomId = req.params.id;
    const roomOpt = roomStorage.get(roomId);
    if ("None" in roomOpt) {
      res
        .status(400)
        .send(`couldn't find a room with id=${roomId}. room not found`);
    } else {
      const room = roomOpt.Some;
      const isMember = room.members.includes(ic.caller().toString());
      if (!isMember) {
        res
          .status(400)
          .send(`couldn't find a room with id=${roomId}. not authorized`);
      }

      const messages = messageStorage.values(); // get all the messages
      const returnedMessages: Message[] = [];

      for (const message of messages) {
        if (message.roomId === roomId) {
          returnedMessages.push(message); // filter messages for that room only
        }
      }
      res.json(returnedMessages);
    }
  });

  app.delete("/messages/:id/", (req, res) => {
    const messageId = req.params.id;
    const messageOpt = messageStorage.get(messageId);

    if ("None" in messageOpt) {
      res
        .status(400)
        .send(
          `couldn't delete a message with id=${messageId}. message not found`
        );
    } else {
      const message = messageOpt.Some;
      if (ic.caller().toString() !== message.sender) {
        res
          .status(400)
          .send(
            `couldn't update a message with id=${messageId}. not authorized`
          );
      }
      const deletedRoomOpt = messageStorage.remove(messageId);
      res.json(deletedRoomOpt.Some);
    }
  });

  return app.listen();
});

function getCurrentDate() {
  const timestamp = new Number(ic.time());
  return new Date(timestamp.valueOf() / 1000_000);
}
