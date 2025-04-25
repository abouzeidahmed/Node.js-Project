

// scripts/seed.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../src/config/db';
import { Item } from '../src/models/item.model';
import { items } from '../src/data/items';

dotenv.config();

const seedItems = async () => {
  try {
    await connectDB();

    // 1) Clear existing items
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing items');

    // 2) Insert dummy items
    const inserted = await Item.insertMany(items);
    console.log(`✅ Inserted ${inserted.length} items`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding items:', err);
    process.exit(1);
  }
};

seedItems();
