// import { addUserToInvitation, createInvitation, deleteUserFromInvitation, updateInvitation } from "./db/db.js";

import JsonDB from "./db/JsonDB.js";


// // Create a new invitation
// const newInvitation = await createInvitation(['Test User', 'Another User']);
// console.log('Created Invitation:', newInvitation);

// // Add a new user to the invitation
// const updatedInvitation = await addUserToInvitation(newInvitation.id, 'New User');
// console.log('Updated Invitation:', updatedInvitation);

// // Delete a user from the invitation
// const deletedUserInvitation = await deleteUserFromInvitation(newInvitation.id, 1);
// console.log('Deleted User Invitation:', deletedUserInvitation);

// // Update an invitation
// const updatedInvitationDetails = await updateInvitation(newInvitation.id, {
//   users: [
//     { name: 'Updated User', blocked: true, confirmed: true },
//     { name: 'Another User', blocked: false, confirmed: false },
//   ],
// });
// console.log('Updated Invitation Details:', updatedInvitationDetails);






// db.insert("menus", {
//   title: "Menú de Carne",
//   description: "A full-course vegetarian meal.",
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString()
// });

// db.insert("menus", {
//   title: "Menú Infantil",
//   description: "A full-course vegetarian meal.",
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString()
// });

// db.insert("menus", {
//   title: "Menú de Carne",
//   description: "A full-course vegetarian meal.",
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString()
// });


// db.insert("invitations", {
//   code: "ABC123",
//   name: "John Doe",
//   leader: true,
//   name_locked: true,
//   menu_id: "1",
//   confirmed: null,
//   created_at: new Date().toISOString(),
//   updated_at: new Date().toISOString()
// });