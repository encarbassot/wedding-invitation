import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from "fs-extra";
import JsonDB from './JsonDB.js';

export const db = new JsonDB({
  menus: {
    id: { type: "string", primary: true, unique: true, autoIncrement: true },
    title: { type: "string", notNull: true },
    description: { type: "string", notNull: true },
    created_at: { type: "string", notNull: true },
    updated_at: { type: "string", notNull: true }
  },
  invitations: {
    id: { type: "string", primary: true, unique: true, autoIncrement: true },
    code: { type: "string", notNull: true },
    name: { type: "string", notNull: true },
    leader: { type: "boolean", notNull: true },
    name_locked: { type: "boolean", notNull: true },
    menu_id: { type: "string", notNull: false },
    confirmed: { type: "boolean", notNull: false },
    created_at: { type: "string", notNull: true },
    updated_at: { type: "string", notNull: true }
  }
})


const __dirname = dirname(fileURLToPath(import.meta.url));

const FILE_PATH = path.join(__dirname, "db.json");

// Helper function to read the JSON file
export async function readData() {
  try {
    const data = await fs.readJson(FILE_PATH);
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

// Helper function to write to the JSON file
async function writeData(data) {
  try {
    await fs.writeJson(FILE_PATH, data, { spaces: 2 });
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Function to create a new invitation
export async function createInvitation(users) {
  const invitations = await readData();

  const newInvitation = {
    id: generateId(), // Generate a unique ID
    users: users.map((name) => ({
      name,
      blocked: false,
      confirmed: null,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  invitations.push(newInvitation);
  await writeData(invitations);

  return newInvitation;
}

// Function to update an invitation
export async function updateInvitation(id, updates) {
  const invitations = await readData();
  const invitationIndex = invitations.findIndex((inv) => inv.id === id);

  if (invitationIndex === -1) {
    throw new Error('Invitation not found');
  }

  const updatedInvitation = {
    ...invitations[invitationIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  invitations[invitationIndex] = updatedInvitation;
  await writeData(invitations);

  return updatedInvitation;
}

// Function to add a new user to an invitation
export async function addUserToInvitation(id, userName) {
  const invitations = await readData();
  const invitationIndex = invitations.findIndex((inv) => inv.id === id);

  if (invitationIndex === -1) {
    throw new Error('Invitation not found');
  }

  const newUser = {
    name: userName,
    blocked: false,
    confirmed: null,
  };

  invitations[invitationIndex].users.push(newUser);
  invitations[invitationIndex].updatedAt = new Date().toISOString();

  await writeData(invitations);

  return invitations[invitationIndex];
}

// Function to delete a user from an invitation by index
export async function deleteUserFromInvitation(id, userIndex) {
  const invitations = await readData();
  const invitationIndex = invitations.findIndex((inv) => inv.id === id);

  if (invitationIndex === -1) {
    throw new Error('Invitation not found');
  }

  if (userIndex < 0 || userIndex >= invitations[invitationIndex].users.length) {
    throw new Error('Invalid user index');
  }

  invitations[invitationIndex].users.splice(userIndex, 1);
  invitations[invitationIndex].updatedAt = new Date().toISOString();

  await writeData(invitations);

  return invitations[invitationIndex];
}




