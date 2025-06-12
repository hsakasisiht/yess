const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete cart items first to avoid foreign key constraint errors
  await prisma.cartItem.deleteMany();
  // Delete existing products to avoid duplicates
  await prisma.product.deleteMany();
//
  // All Gems/Materials from Lords Mobile gems mall
  await prisma.product.createMany({
    data: [
  // Speed Ups
  { name: 'Speed Up 1m', description: 'Speed up your progress by 1 minute.', imageUrl: 'https://i.ibb.co/3yM5VjbZ/Speed-Up-1.webp', category: 'GEMS', price: 130, gemCost: 130 },
  { name: 'Speed Up 15m', description: 'Speed up your progress by 15 minutes.', imageUrl: 'https://i.ibb.co/3yM5VjbZ/Speed-Up-1.webp', category: 'GEMS', price: 130, gemCost: 130 },
  { name: 'Speed Up 60m', description: 'Speed up your progress by 60 minutes.', imageUrl: 'https://i.ibb.co/3yM5VjbZ/Speed-Up-1.webp', category: 'GEMS', price: 130, gemCost: 130 },
  { name: 'Speed Up 3h', description: 'Speed up your progress by 3 hours.', imageUrl: 'https://i.ibb.co/j9nF6Kwd/Speed-Up-2.webp', category: 'GEMS', price: 300, gemCost: 300 },
  { name: 'Speed Up 8h', description: 'Speed up your progress by 8 hours.', imageUrl: 'https://i.ibb.co/j9nF6Kwd/Speed-Up-2.webp', category: 'GEMS', price: 650, gemCost: 650 },
  { name: 'Speed Up 15h', description: 'Speed up your progress by 15 hours.', imageUrl: 'https://i.ibb.co/j9nF6Kwd/Speed-Up-2.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  { name: 'Speed Up 24h', description: 'Speed up your progress by 24 hours.', imageUrl: 'https://i.ibb.co/j9nF6Kwd/Speed-Up-2.webp', category: 'GEMS', price: 1500, gemCost: 1500 },
  { name: 'Speed Up 3d', description: 'Speed up your progress by 3 days.', imageUrl: 'https://i.ibb.co/RG1Ly0LJ/Speed-Up-3.webp', category: 'GEMS', price: 4400, gemCost: 4400 },
  { name: 'Speed Up 7d', description: 'Speed up your progress by 7 days.', imageUrl: 'https://i.ibb.co/RG1Ly0LJ/Speed-Up-3.webp', category: 'GEMS', price: 10000, gemCost: 10000 },
  { name: 'Speed Up 30d', description: 'Speed up your progress by 30 days.', imageUrl: 'https://i.ibb.co/RG1Ly0LJ/Speed-Up-3.webp', category: 'GEMS', price: 40000, gemCost: 40000 },
  { name: 'Winged Boosts I', description: 'Reduces Squad Travel Time by 25%', imageUrl: 'https://i.ibb.co/yF4N31Kn/Winged-Boots-1.webp', category: 'GEMS', price: 500, gemCost: 500 },
  { name: 'Winged Boosts II', description: 'Reduces Squad Travel Time by 50%', imageUrl: 'https://i.ibb.co/yF4N31Kn/Winged-Boots-1.webp', category: 'GEMS', price: 900, gemCost: 900 },

  { name: 'Gather Boost (50%)', description: 'Increases Gathering Speed, Last 24 Hours', imageUrl: 'https://i.ibb.co/67dLLLgy/Gather-Boost.webp', category: 'GEMS', price: 600, gemCost: 600 },
  { name: 'Gather Boost (50%)', description: 'Increases Gathering Speed, Last 7 Days', imageUrl: 'https://i.ibb.co/67dLLLgy/Gather-Boost.webp', category: 'GEMS', price: 3360, gemCost: 3360 },

  { name: 'Speed Up Merging 1m', description: 'Reduces Time Taken For Merging By 1 minute.', imageUrl: 'https://i.ibb.co/sp8FsjDF/Speed-Up-Merging-1.webp', category: 'GEMS', price: 10, gemCost: 10 },
  { name: 'Speed Up Merging 15m', description: 'Reduces Time Taken For Merging By 15 minutes.', imageUrl: 'https://i.ibb.co/sp8FsjDF/Speed-Up-Merging-1.webp', category: 'GEMS', price: 140, gemCost: 140 },
  { name: 'Speed Up Merging 60m', description: 'Reduces Time Taken For Merging By 60 minutes.', imageUrl: 'https://i.ibb.co/sp8FsjDF/Speed-Up-Merging-1.webp', category: 'GEMS', price: 260, gemCost: 260 },
  { name: 'Speed Up Merging 3h', description: 'Reduces Time Taken For Merging By 3 hours.', imageUrl: 'https://i.ibb.co/sdNnPDKv/Speed-Up-Merging-2.webp', category: 'GEMS', price: 600, gemCost: 600 },
  { name: 'Speed Up Merging 8h', description: 'Reduces Time Taken For Merging By 8 hours.', imageUrl: 'https://i.ibb.co/sdNnPDKv/Speed-Up-Merging-2.webp', category: 'GEMS', price: 1300, gemCost: 1300 },
  { name: 'Speed Up Merging 15h', description: 'Reduces Time Taken For Merging By 15 hours.', imageUrl: 'https://i.ibb.co/sdNnPDKv/Speed-Up-Merging-2.webp', category: 'GEMS', price: 2000, gemCost: 2000 },
  { name: 'Speed Up Merging 24h', description: 'Reduces Time Taken For Merging By 24 hours.', imageUrl: 'https://i.ibb.co/sdNnPDKv/Speed-Up-Merging-2.webp', category: 'GEMS', price: 3000, gemCost: 3000 },
  { name: 'Speed Up Merging 3d', description: 'Reduces Time Taken For Merging By 3 days.', imageUrl: 'https://i.ibb.co/dsmxryZN/Speed-Up-Merging-3.webp', category: 'GEMS', price: 8800, gemCost: 8800 },
  { name: 'Speed Up Merging 7d', description: 'Reduces Time Taken For Merging By days.', imageUrl: 'https://i.ibb.co/dsmxryZN/Speed-Up-Merging-3.webp', category: 'GEMS', price: 20000, gemCost:20000 },

    // Braveheart
    { name: 'Braveheart', description: 'Grants 120 STA.', imageUrl: 'https://i.ibb.co/TBqhDGF5/Braveheart.webp', category: 'GEMS', price: 2000, gemCost: 2000 },
  
    // Withdraw Squad
    { name: 'Withdraw Squad', description: 'Recalls a Squad back to your Turf before it reaches its destination.', imageUrl: 'https://i.ibb.co/21HhCrpd/Withdraw-Squad.webp', category: 'GEMS', price: 40, gemCost: 40 },
  
    // Random Relocator
    { name: 'Random Relocator', description: 'Transfer your Turf to a random location in the current Kingdom.', imageUrl: 'https://i.ibb.co/qM6yCNxF/Random-Relocator.webp', category: 'GEMS', price: 500, gemCost: 500 },
  
    // Guild Tag Change
    { name: 'Guild Tag Change', description: "Change your guild's Tag. (Guild Leader only)", imageUrl: 'https://i.ibb.co/7dMfSt2s/Guild-Name-Changer-1.webp', category: 'GEMS', price: 200, gemCost: 200 },
  
    // Nickname (Guild) Changer
    { name: 'Nickname (Guild) Changer', description: 'Change your in-Guild Nickname.', imageUrl: 'https://i.ibb.co/F48QxVXJ/Nickname-29-Changer.webp', category: 'GEMS', price: 200, gemCost: 200 },
  
    // Royal Pass
    { name: 'Royal Pass', description: 'Transfer your Turf to a Target Location in the Royal Battleground. (Castle Lv 25 only)', imageUrl: 'https://i.ibb.co/zWNHkpnM/Royal-Pass.webp', category: 'GEMS', price: 100000, gemCost: 100000 },
  
    // Relocator
    { name: 'Relocator', description: 'Transfer your Turf to a Target Location in the current kingdom.', imageUrl: 'https://i.ibb.co/YThtT4Bs/Relocator.webp', category: 'GEMS', price: 1500, gemCost: 1500 },
  
    // Name-Changer
    { name: 'Name-Changer', description: 'Change your name.', imageUrl: 'https://i.ibb.co/rGzLqw23/Name-changer.webp', category: 'GEMS', price: 100, gemCost: 100 },
  
    // Guild Name-Changer
    { name: 'Guild Name-Changer', description: "Change your guild's Name. (Guild Leader only)", imageUrl: 'https://i.ibb.co/7dMfSt2s/Guild-Name-Changer-1.webp', category: 'GEMS', price: 200, gemCost: 200 },
  
    // Talent Reset
    { name: 'Talent Reset', description: 'Resets your Talent Points allocation.', imageUrl: 'https://i.ibb.co/GmxYk0f/Talent-Reset.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Finish Demolition
    { name: 'Finish Demolition', description: 'Demolishes a building instantly.', imageUrl: 'https://i.ibb.co/5hkLDTrS/Finish-Demolition.webp', category: 'GEMS', price: 20, gemCost: 20 },
  
    // Revival Fruit
    { name: 'Revival Fruit', description: 'Revives a Leader.', imageUrl: 'https://i.ibb.co/HD33hNDP/Revival-Fruit.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Bookmark Space
    { name: 'Bookmark Space', description: 'Grants 10 Bookmark slots.', imageUrl: 'https://i.ibb.co/HfQ5p11Z/Bookmark-Space.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Quest Scroll (Admin)
    { name: 'Quest Scroll (Admin)', description: 'Refreshes the list of Admin Quests, with chances of raising the Quest Grade.', imageUrl: 'https://i.ibb.co/mVPLZPWB/Admin-Quest-Scroll.webp', category: 'GEMS', price: 800, gemCost: 800 },
  
    // Quest Scroll (Guild)
    { name: 'Quest Scroll (Guild)', description: 'Refreshes the list of Guild Quests, with chances of raising the Quest Grade.', imageUrl: 'https://i.ibb.co/1YYtqyRT/Guild-Quest-Scroll.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Cabinet Expander
    { name: 'Cabinet Expander', description: 'Grants four Cabinet slots.', imageUrl: 'https://i.ibb.co/0yTx1t97/Cabinet-Expander.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Energy Items
    { name: '1,000 Energy', description: 'Grants 1,000 Energy.', imageUrl: 'https://i.ibb.co/xqfM0JCN/Energy-Item-4.webp', category: 'GEMS', price: 250, gemCost: 250 },
    { name: '2,000 Energy', description: 'Grants 2,000 Energy.', imageUrl: 'https://i.ibb.co/xqfM0JCN/Energy-Item-4.webp', category: 'GEMS', price: 475, gemCost: 475 },
    { name: '5,000 Energy', description: 'Grants 5,000 Energy.', imageUrl: 'https://i.ibb.co/xqfM0JCN/Energy-Item-4.webp', category: 'GEMS', price: 1125, gemCost: 1125 },
    { name: '10,000 Energy', description: 'Grants 10,000 Energy.', imageUrl: 'https://i.ibb.co/xqfM0JCN/Energy-Item-4.webp', category: 'GEMS', price: 2000, gemCost: 2000 },
    { name: '20,000 Energy', description: 'Grants 20,000 Energy.', imageUrl: 'https://i.ibb.co/xqfM0JCN/Energy-Item-4.webp', category: 'GEMS', price: 3500, gemCost: 3500 },
    { name: '50,000 Energy', description: 'Grants 50,000 Energy.', imageUrl: 'https://i.ibb.co/xqfM0JCN/Energy-Item-4.webp', category: 'GEMS', price: 7500, gemCost: 7500 },
  
    // War Tome
    { name: 'War Tome', description: 'Essential for upgrading your Battle Hall.', imageUrl: 'https://i.ibb.co/fdc7L8j7/War-Tome.webp', category: 'GEMS', price: 15, gemCost: 15 },
  
    // Crystal Pickaxe
    { name: 'Crystal Pickaxe', description: 'Essential for upgrading your Treasure Trove.', imageUrl: 'https://i.ibb.co/NgSdyBFh/Crystal-Pickaxe.webp', category: 'GEMS', price: 20, gemCost: 20 },
  
    // Steel Cuffs
    { name: 'Steel Cuffs', description: 'Essential for upgrading your Prison.', imageUrl: 'https://i.ibb.co/VcHxS3c6/Steel-Cuffs.webp', category: 'GEMS', price: 15, gemCost: 15 },
  
    // Soul Crystal
    { name: 'Soul Crystal', description: 'Essential for upgrading your Altar.', imageUrl: 'https://i.ibb.co/5Xmrz0Tj/Soul-Crystal.webp', category: 'GEMS', price: 15, gemCost: 15 },
  
    // Gold Hammer
    { name: 'Gold Hammer', description: 'Essential for Lv 25 Building Upgrades.', imageUrl: 'https://i.ibb.co/gM6PzwSD/Gold-Hammer.webp', category: 'GEMS', price: 2000, gemCost: 2000 },
  
    // Chisels
    { name: 'Chisel I', description: 'Extract a Common Jewel from an Equipment.', imageUrl: 'https://i.ibb.co/KpBYmRFS/Chisel-I.webp', category: 'GEMS', price: 400, gemCost: 400 },
    { name: 'Chisel II', description: 'Extract a Common - Uncommon Jewel from an Equipment.', imageUrl: 'https://i.ibb.co/5h8H1nV2/Chisel-II.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
    { name: 'Chisel III', description: 'Extract a Common - Rare Jewel from an Equipment.', imageUrl: 'https://i.ibb.co/LzvSgj9n/Chisel-III.webp', category: 'GEMS', price: 2000, gemCost: 2000 },
    { name: 'Chisel IV', description: 'Extract a Common - Epic Jewel from an Equipment.', imageUrl: 'https://i.ibb.co/6J8tsJBH/Chisel-IV.webp', category: 'GEMS', price: 3000, gemCost: 3000 },
    { name: 'Chisel V', description: 'Extract a Common - Legendary Jewel from an Equipment.', imageUrl: 'https://i.ibb.co/j98BgQSk/Chisel-V.webp', category: 'GEMS', price: 4000, gemCost: 4000 },
  
    // 25% Player EXP Boost
    { name: '25% Player EXP Boost', description: 'Increases Player EXP by 25% for 24 hours.', imageUrl: 'https://i.ibb.co/m5qMTtsQ/Player-EXP-Boost.webp', category: 'GEMS', price: 2500, gemCost: 2500 },
  
    // 25% Monster Hunter ATK Boost
    { name: '25% Monster Hunter ATK Boost', description: 'Increases damage in a Monster Hunt by 25% for 30 minutes.', imageUrl: 'https://i.ibb.co/GQqSW1Nh/Monster-Hunter-ATK-Boost-1.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Gravel
    { name: 'Gravel', description: 'Extinguishes Castle fires.', imageUrl: 'https://i.ibb.co/Hkz8j11/Gravel.webp', category: 'GEMS', price: 1500, gemCost: 1500 },
  
    // Talent Tome
    { name: 'Talent Tome', description: 'Use to save a Talent set.', imageUrl: 'https://i.ibb.co/gZ9FWpdn/Talent-Tome.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Equipment Quill
    { name: 'Equipment Quill', description: 'Use to save an Equipment set.', imageUrl: 'https://i.ibb.co/b5syQtT1/Equipment-Quill.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Holy Stars
    { name: '10 Holy Stars', description: 'Grants 10 Holy Stars.', imageUrl: 'https://i.ibb.co/4gZH6H0G/Holy-Stars-Item-3.webp', category: 'GEMS', price: 30, gemCost: 30 },
    { name: '100 Holy Stars', description: 'Grants 100 Holy Stars.', imageUrl: 'https://i.ibb.co/4gZH6H0G/Holy-Stars-Item-3.webp', category: 'GEMS', price: 240, gemCost: 240 },
    { name: '1,000 Holy Stars', description: 'Grants 1,000 Holy Stars.', imageUrl: 'https://i.ibb.co/4gZH6H0G/Holy-Stars-Item-3.webp', category: 'GEMS', price: 2200, gemCost: 2200 },
    { name: '10,000 Holy Stars', description: 'Grants 10,000 Holy Stars.', imageUrl: 'https://i.ibb.co/4gZH6H0G/Holy-Stars-Item-3.webp', category: 'GEMS', price: 20000, gemCost: 20000 },
  
    // Emote Stamp
    { name: 'Emote Stamp', description: 'Display an emote to tag travelling troops or a location.', imageUrl: 'https://i.ibb.co/FqyTr56S/Emote-Stamp.webp', category: 'GEMS', price: 1500, gemCost: 1500 },
  
    // Anima
    { name: '3,000 Anima', description: 'Grants 3,000 Anima.', imageUrl: 'https://i.ibb.co/VWQ8pzd4/Anima-6.webp', category: 'GEMS', price: 40, gemCost: 40 },
    { name: '15,000 Anima', description: 'Grants 15,000 Anima.', imageUrl: 'https://i.ibb.co/VWQ8pzd4/Anima-6.webp', category: 'GEMS', price: 160, gemCost: 160 },
    { name: '50,000 Anima', description: 'Grants 50,000 Anima.', imageUrl: 'https://i.ibb.co/VWQ8pzd4/Anima-6.webp', category: 'GEMS', price: 400, gemCost: 400 },
    { name: '200,000 Anima', description: 'Grants 200,000 Anima.', imageUrl: 'https://i.ibb.co/VWQ8pzd4/Anima-6.webp', category: 'GEMS', price: 1200, gemCost: 1200 },
    { name: '600,000 Anima', description: 'Grants 600,000 Anima.', imageUrl: 'https://i.ibb.co/VWQ8pzd4/Anima-6.webp', category: 'GEMS', price: 3300, gemCost: 3300 },
    { name: '2,000,000 Anima', description: 'Grants 2,000,000 Anima.', imageUrl: 'https://i.ibb.co/VWQ8pzd4/Anima-6.webp', category: 'GEMS', price: 10000, gemCost: 10000 },
    { name: '6,000,000 Anima', description: 'Grants 6,000,000 Anima.', imageUrl: 'https://i.ibb.co/VWQ8pzd4/Anima-6.webp', category: 'GEMS', price: 28000, gemCost: 28000 },
  
    // Ancient Core
    { name: 'Ancient Core', description: 'Used to merge Skillstones.', imageUrl: 'https://i.ibb.co/JjKth5Nx/Ancient-Core.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
  
    // Chaos Core
    { name: 'Chaos Core', description: 'Used to merge Skillstones.', imageUrl: 'https://i.ibb.co/VWLrnzzL/Chaos-Core.webp', category: 'GEMS', price: 7500, gemCost: 7500 },
  
    // Archaic Tome
    { name: 'Archaic Tome', description: 'Essential for researching Tech in the Academy.', imageUrl: 'https://i.ibb.co/d0bqs89w/Archaic-Tome.webp', category: 'GEMS', price: 900, gemCost: 900 },
  
    // Extractors
    { name: 'Extractor I', description: 'Extract a Common Sigil from an Equipment.', imageUrl: 'https://i.ibb.co/JwqsHC2p/Extractor-I.webp', category: 'GEMS', price: 600, gemCost: 600 },
    { name: 'Extractor II', description: 'Extract a Common - Uncommon Sigil from an Equipment.', imageUrl: 'https://i.ibb.co/xtFfLRK1/Extractor-II.webp', category: 'GEMS', price: 1500, gemCost: 1500 },
    { name: 'Extractor III', description: 'Extract a Common - Rare Sigil from an Equipment.', imageUrl: 'https://i.ibb.co/TB0166Zc/Extractor-III.webp', category: 'GEMS', price: 3000, gemCost: 3000 },
    { name: 'Extractor IV', description: 'Extract a Common - Epic Sigil from an Equipment.', imageUrl: 'https://i.ibb.co/0pgX39qW/Extractor-IV.webp', category: 'GEMS', price: 4500, gemCost: 4500 },
    { name: 'Extractor V', description: 'Extract a Common - Legendary Sigil from an Equipment.', imageUrl: 'https://i.ibb.co/tw494wpM/Extractor-V.webp', category: 'GEMS', price: 6000, gemCost: 6000 },
  
    // Luck Tokens
    { name: 'Luck Token', description: 'Grants 1 Luck Token.', imageUrl: 'https://i.ibb.co/F4kkKN19/Luck-Token-Item-2.webp', category: 'GEMS', price: 720, gemCost: 720 },
    { name: '10 Luck Tokens', description: 'Grants 10 Luck Tokens.', imageUrl: 'https://i.ibb.co/F4kkKN19/Luck-Token-Item-2.webp', category: 'GEMS', price: 6600, gemCost: 6600 },
    { name: '100 Luck Tokens', description: 'Grants 100 Luck Tokens.', imageUrl: 'https://i.ibb.co/F4kkKN19/Luck-Token-Item-2.webp', category: 'GEMS', price: 60000, gemCost: 60000 },
  
    // Bright Talent Orb
    { name: 'Bright Talent Orb', description: 'Awaken and upgrade Army Talents for Familiars (Rarity 1-3).', imageUrl: 'https://i.ibb.co/Rdv16Z0/Bright-Talent-Orb.webp', category: 'GEMS', price: 3000, gemCost: 3000 },
  
    // Brilliant Talent Orb
    { name: 'Brilliant Talent Orb', description: 'Awaken and upgrade Army Talents for Familiars (Rarity 4-5).', imageUrl: 'https://i.ibb.co/6cjxY83g/Brilliant-Talent-Orb.webp', category: 'GEMS', price: 7500, gemCost: 7500 },
  
    // VIP Points
    { name: '100 VIP Points', description: 'Grants 100 VIP Points.', imageUrl: 'https://i.ibb.co/tp0PQnjq/VIP-Points-Item-2.webp', category: 'GEMS', price: 150, gemCost: 150 },
    { name: '500 VIP Points', description: 'Grants 500 VIP Points.', imageUrl: 'https://i.ibb.co/tp0PQnjq/VIP-Points-Item-2.webp', category: 'GEMS', price: 500, gemCost: 500 },
    { name: '1,000 VIP Points', description: 'Grants 1,000 VIP Points.', imageUrl: 'https://i.ibb.co/tp0PQnjq/VIP-Points-Item-2.webp', category: 'GEMS', price: 1000, gemCost: 1000 },
    { name: '5,000 VIP Points', description: 'Grants 5,000 VIP Points.', imageUrl: 'https://i.ibb.co/tp0PQnjq/VIP-Points-Item-2.webp', category: 'GEMS', price: 5000, gemCost: 5000 },

    { name: 'Shield (8h)', description: 'Protect Your Turf For 8 Hours.', imageUrl: 'https://i.ibb.co/CK34PBnn/Shield.webp', category: 'GEMS', price: 500, gemCost: 500 },
    { name: 'Shield (12h)', description: 'Protect Your Turf For 12 Hours.', imageUrl: 'https://i.ibb.co/CK34PBnn/Shield.webp', category: 'GEMS', price: 800, gemCost: 800 },
    { name: 'Shield (24h)', description: 'Protect Your Turf For 24 Hours.', imageUrl: 'https://i.ibb.co/CK34PBnn/Shield.webp', category: 'GEMS', price: 1000, gemCost: 1000 },

    { name: 'Shield (3d)', description: 'Protect Your Turf For 3 Days.', imageUrl: 'https://i.ibb.co/CK34PBnn/Shield.webp', category: 'GEMS', price: 3500, gemCost: 3500 },
    { name: 'Shield (7d)', description: 'Protect Your Turf For 7 Days.', imageUrl: 'https://i.ibb.co/CK34PBnn/Shield.webp', category: 'GEMS', price: 10000, gemCost: 10000 },
    { name: 'Shield (14d)', description: 'Protect Your Turf For 14 Days.', imageUrl: 'https://i.ibb.co/CK34PBnn/Shield.webp', category: 'GEMS', price: 25000, gemCost: 25000 },

    { name: 'Anti-Scout (24h)', description: 'Protect Your Turf From Scouts For 24 Hours.', imageUrl: 'https://i.ibb.co/NgcCFn0r/Anti-Scout.webp', category: 'GEMS', price: 600, gemCost: 600 },
    { name: 'Anti-Scout (7d)', description: 'Protect Your Turf From Scouts For 7 Days.', imageUrl: 'https://i.ibb.co/NgcCFn0r/Anti-Scout.webp', category: 'GEMS', price: 1200, gemCost: 1200 },
    { name: 'Anti-Scout (3d)', description: 'Protect Your Turf From Scouts For 3 Days.', imageUrl: 'https://i.ibb.co/NgcCFn0r/Anti-Scout.webp', category: 'GEMS', price: 3000, gemCost: 3000 },

    { name: 'Reduce Upkeep (25%)', description: 'Reduce Upkeep By 25%. Lasts 24 Hours.', imageUrl: 'https://i.ibb.co/4RYCWVFg/Reduce-Upkeep.webp', category: 'GEMS', price: 500, gemCost: 500 },
    { name: 'Reduce Upkeep (25%)', description: 'Reduce Upkeep By 25%. Lasts 7 Days.', imageUrl: 'https://i.ibb.co/4RYCWVFg/Reduce-Upkeep.webp', category: 'GEMS', price: 2800, gemCost: 2800 },

    
    { name: 'Reduce Upkeep (50%)', description: 'Reduce Upkeep By 50%. Lasts 24 Hours.', imageUrl: 'https://i.ibb.co/4RYCWVFg/Reduce-Upkeep.webp', category: 'GEMS', price: 2000, gemCost: 2000 },
    { name: 'Reduce Upkeep (50%)', description: 'Reduce Upkeep By 50%. Lasts 7 Days.', imageUrl: 'https://i.ibb.co/4RYCWVFg/Reduce-Upkeep.webp', category: 'GEMS', price: 11200, gemCost: 11200 },

    { name: 'False Info (2x)', description: 'Make Your Army Appear Twice as big. Lasts 24 Hours.', imageUrl: 'https://i.ibb.co/P2nhvv7/False-Info.webp', category: 'GEMS', price: 200, gemCost: 200 },
    { name: 'False Info (3x)', description: 'Make Your Army Appear Three Times as big. Lasts 7 Days.', imageUrl: 'https://i.ibb.co/P2nhvv7/False-Info.webp', category: 'GEMS', price: 300, gemCost: 300 },

    { name: 'Army Size Boost (20%)', description: 'Increase Max Army Size by 20%. Lasts 4 Hours.', imageUrl: 'https://i.ibb.co/chMwvsQM/Army-Size-Boost.webp', category: 'GEMS', price: 2400, gemCost: 2400 },
    { name: 'Army Size Boost (50%)', description: 'Increase Max Army Size by 50%. Lasts 4 Hours.', imageUrl: 'https://i.ibb.co/chMwvsQM/Army-Size-Boost.webp', category: 'GEMS', price: 5000, gemCost: 5000 },

    { name: 'Army ATK Boost (20%)', description: 'Increase Army ATK by 20%. Lasts 12 Hours.', imageUrl: 'https://i.ibb.co/RMQ9HXK/Army-ATK-Boost.webp', category: 'GEMS', price: 250, gemCost: 250 },
    { name: 'Army ATK Boost (20%)', description: 'Increase Army ATK by 20%. Lasts 24 Hours.', imageUrl: 'https://i.ibb.co/RMQ9HXK/Army-ATK-Boost.webp', category: 'GEMS', price: 400, gemCost: 400 },

    { name: '[Rare] Material Chest', description: 'Grants Random [Common - Rare] Material.', imageUrl: 'https://i.ibb.co/QWKwsFV/Rare-Material-Chest.webp', category: 'GEMS', price: 1500, gemCost: 1500 },
    { name: '[Epic] Material Chest', description: 'Grants Random [Uncommon - Epic] Material.', imageUrl: 'https://i.ibb.co/Xfrs4cwL/Epic-Material-Chest.webp', category: 'GEMS', price: 3000, gemCost: 3000 },
    { name: '[Legendary] Material Chest', description: 'Grants Random [Common - Legendary] Material.', imageUrl: 'https://i.ibb.co/twfnmnKy/Legendary-Material-Chest.webp', category: 'GEMS', price: 3000, gemCost: 3000 },

    { name: '[Rare] Jewel Chest', description: 'Grants Random [Common - Rare] Jewel.', imageUrl: 'https://i.ibb.co/KckkQhXS/Rare-Jewel-Chest.webp', category: 'GEMS', price: 3000, gemCost: 3000 },
    { name: '[Epic] Jewel Chest', description: 'Grants Random [Uncommon - Epic] Jewel.', imageUrl: 'https://i.ibb.co/m5wVyKZC/Epic-Jewel-Chest.webp', category: 'GEMS', price: 6000, gemCost: 6000 },
    { name: '[Legendary] Jewel Chest', description: 'Grants Random [Common - Legendary] Jewel.', imageUrl: 'https://i.ibb.co/9mdXSWK6/Legendary-Jewel-Chest.webp', category: 'GEMS', price: 6000, gemCost: 6000 },

  ],
  });

  // Resources
  await prisma.product.createMany({
    data: [ 
      // Mixed Resource Packs
      { name: 'FULL BANK (4B EACH TYPE)', description: '4B of each resource type.', imageUrl: '/rss.png', category: 'RESOURCES', price: 3.5 },
      { name: 'HALF BANK (2B EACH TYPE)', description: '2B of each resource type.', imageUrl: '/rss.png', category: 'RESOURCES', price: 2.3 },
      { name: 'FULL BANK NO GOLD (4B EACH BUT NO GOLD)', description: '4B of each resource type except gold.', imageUrl: '/rss.png', category: 'RESOURCES', price: 2.5 },
      { name: 'HALF BANK (2B EACH BUT NO GOLD)', description: '2B of each resource type except gold.', imageUrl: '/rss.png', category: 'RESOURCES', price: 1.5 },
      { name: '11111 (1B EACH TYPE RESOURCES)', description: '1B of each resource type.', imageUrl: '/rss.png', category: 'RESOURCES', price: 1.6 },
      { name: '11110 (1B EACH TYPE BUT NO GOLD)', description: '1B of each resource type except gold.', imageUrl: '/rss.png', category: 'RESOURCES', price: 1 },
      // ... add more resources as needed ...
    ],
  });

  // Bots
  await prisma.product.createMany({
    data: [
      {
        name: 'Bank Bot',
        description: 'Automate your in-game banking.',
        imageUrl: '',
        category: 'BOTS',
        price: 5000,
        botType: 'bank',
      },
      {
        name: 'War Bot',
        description: 'Get real-time war notifications and analytics.',
        imageUrl: '',
        category: 'BOTS',
        price: 7000,
        botType: 'war',
      },
      {
        name: 'Location Finding Bot',
        description: 'Find player and resource locations easily.',
        imageUrl: '',
        category: 'BOTS',
        price: 6000,
        botType: 'location',
      },
      {
        name: 'WhatsApp Bot',
        description: 'Integrate Lords Mobile with WhatsApp.',
        imageUrl: '',
        category: 'BOTS',
        price: 4000,
        botType: 'whatsapp',
      },
      {
        name: 'Telegram Bot',
        description: 'Integrate Lords Mobile with Telegram.',
        imageUrl: '',
        category: 'BOTS',
        price: 4000,
        botType: 'telegram',
      },
      {
        name: 'Discord Bot',
        description: 'Integrate Lords Mobile with Discord.',
        imageUrl: '',
        category: 'BOTS',
        price: 4000,
        botType: 'discord',
      },
    ],
  });

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 