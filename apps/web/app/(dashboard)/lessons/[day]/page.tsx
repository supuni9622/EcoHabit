'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { useAuthStore } from '../../../../lib/store/auth.store';
import { useGamificationStore } from '../../../../lib/store/gamification.store';
import { LessonQuiz } from '../../../../components/lessons/LessonQuiz';
import type { QuizQuestion } from '../../../../components/lessons/LessonQuiz';
import { trackLessonCompleted } from '../../../../lib/services/analytics';

const LESSONS_DATA: Record<
  string,
  {
    day: number;
    title: string;
    icon: string;
    story: string;
    keyMessage: string;
    reflection: string;
    facts: string[];
    points: number;
    quiz: QuizQuestion[];
  }
> = {
  '1': {
    day: 1,
    title: 'The Plastic Crisis',
    icon: '🥤',
    story: `Every year, over 380 million tonnes of plastic are produced worldwide. The vast majority of it ends up in landfills, oceans, and ecosystems where it persists for hundreds of years.

A plastic bottle you use for 10 minutes will take 450 years to decompose. Microplastics have been found in the deepest ocean trenches, in Arctic ice, and even in human blood.

Sri Lanka, with its beautiful coastlines, faces a particularly acute plastic waste challenge. Colombo's waterways carry plastic waste to the Indian Ocean daily. But communities are fighting back.

In 2020, Sri Lanka became one of the first countries to ban single-use plastic items. Local heroes like the Colombo Recycling Centre collect over 2 tonnes of plastic weekly.

Your plastic recycling actions, no matter how small, are part of this global movement.`,
    keyMessage: 'Every piece of plastic you recycle removes it from the cycle of pollution.',
    reflection:
      'Think about the plastic items you used today. How many could be replaced with reusable alternatives?',
    facts: [
      '8 million tonnes of plastic enter our oceans every year',
      'Only 9% of all plastic ever produced has been recycled',
      'Plastic bags can take up to 1,000 years to decompose',
      'Sri Lanka banned single-use plastics in 2020',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How long does a plastic bottle take to decompose?',
        options: ['10 years', '100 years', '450 years', '1000 years'],
        correctIndex: 2,
        explanation: 'Plastic bottles can take up to 450 years to decompose in a landfill.',
      },
      {
        type: 'true-false',
        question: 'Only 9% of all plastic ever produced has been recycled.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'Despite decades of recycling programs, only about 9% of all plastic ever produced has been formally recycled.',
      },
      {
        type: 'multiple-choice',
        question: 'What did Sri Lanka ban in 2020?',
        options: ['Glass bottles', 'Aluminum cans', 'Single-use plastics', 'Paper bags'],
        correctIndex: 2,
        explanation: 'Sri Lanka was one of the first countries in Asia to ban single-use plastic items in 2020.',
      },
    ],
  },
  '2': {
    day: 2,
    title: 'Paper and Forests',
    icon: '📄',
    story: `Forests are the lungs of our planet. They absorb CO₂, provide habitat for 80% of terrestrial species, and regulate our climate. Yet every year, 15 billion trees are cut down — many for paper products.

The good news: paper is one of the most recyclable materials on Earth. Recycled paper requires 70% less energy to produce than virgin paper and uses 60% less water.

In Sri Lanka, the traditional practice of "olai" — writing on palm leaves — was eco-friendly before paper replaced it. Modern Sri Lankan recycling initiatives are reviving appreciation for sustainable practices.

One ton of recycled paper saves 17 trees, 7,000 gallons of water, and enough energy to power an average home for six months.

When you sort your newspapers, cardboard boxes, and office paper for recycling, you're protecting forests globally.`,
    keyMessage: 'Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
    reflection:
      'How much paper does your household use weekly? Could you switch to digital alternatives for some of it?',
    facts: [
      'Paper can be recycled up to 7 times before fibers degrade',
      'Recycling 1 ton of paper saves 17 trees',
      '40% of municipal solid waste is paper products',
      'Recycled paper uses 60% less water to produce',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How many trees does recycling 1 ton of paper save?',
        options: ['5 trees', '10 trees', '17 trees', '25 trees'],
        correctIndex: 2,
        explanation: 'Recycling one ton of paper saves approximately 17 trees from being cut down.',
      },
      {
        type: 'true-false',
        question: 'Paper can be recycled indefinitely.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Paper fibers shorten with each recycling cycle — paper can typically be recycled 5-7 times before the fibers are too short.',
      },
      {
        type: 'multiple-choice',
        question: 'Recycled paper uses what percentage less water than virgin paper?',
        options: ['20%', '40%', '60%', '80%'],
        correctIndex: 2,
        explanation: 'Producing recycled paper uses approximately 60% less water compared to making paper from fresh wood pulp.',
      },
    ],
  },
  '3': {
    day: 3,
    title: 'E-Waste: The Hidden Danger',
    icon: '💻',
    story: `Your old smartphone contains gold, silver, copper, and rare earth elements — but also lead, mercury, cadmium, and arsenic. When improperly disposed of, these toxins leach into soil and water.

E-waste is the fastest growing waste stream globally — 53.6 million tonnes in 2019 alone. Only 17.4% was formally recycled. The rest went to landfills or was informally processed in ways harmful to workers and communities.

In Sri Lanka, e-waste collection is growing. Organizations like HiEnergy Lanka collect electronics and ensure they're recycled responsibly. Samsung and other brands offer take-back programs.

But there's more than recycling: the most sustainable device is the one you already have. Extending your phone's life by even one year significantly reduces your carbon footprint.

Before replacing any device, ask: can it be repaired? Can I donate it?`,
    keyMessage: 'E-waste contains toxic materials that can leach into soil and water for decades.',
    reflection:
      'List the electronic devices in your home. When was the last time you properly disposed of an old device?',
    facts: [
      'E-waste is the fastest growing waste stream globally',
      'Only 17.4% of e-waste was formally recycled in 2019',
      'A smartphone contains 60+ elements from the periodic table',
      'Properly recycled electronics recover valuable materials worth billions',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What percentage of e-waste was formally recycled in 2019?',
        options: ['5%', '17.4%', '35%', '50%'],
        correctIndex: 1,
        explanation: 'Only 17.4% of the 53.6 million tonnes of e-waste generated in 2019 was formally recycled.',
      },
      {
        type: 'true-false',
        question: 'A smartphone contains materials from more than 60 elements of the periodic table.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'Modern smartphones are remarkably complex — they contain over 60 different elements including gold, silver, copper, and rare earth metals.',
      },
      {
        type: 'multiple-choice',
        question: 'What is the most sustainable approach to electronics?',
        options: ['Buy the newest model', 'Extend your current device\'s life', 'Donate old devices', 'Recycle immediately'],
        correctIndex: 1,
        explanation: 'The most sustainable device is the one you already have — extending its life by even one year significantly reduces your carbon footprint.',
      },
    ],
  },
  '4': {
    day: 4,
    title: 'Composting Basics',
    icon: '🍎',
    story: `Food waste is a massive environmental problem. When organic matter ends up in landfills, it decomposes without oxygen and releases methane — a greenhouse gas 80 times more potent than CO₂ over a 20-year period.

Composting transforms this problem into a solution. By decomposing organic material with oxygen, we create rich humus that improves soil health, reduces need for chemical fertilizers, and sequesters carbon.

In Sri Lanka's agricultural heartland, many farmers still practice traditional composting. Urban composting initiatives in Colombo and Kandy are spreading this knowledge to city dwellers.

Starting a compost is simpler than you think. Kitchen scraps (vegetables, fruit peels, coffee grounds), yard waste (leaves, grass clippings), and paper products can all be composted.

What cannot be composted: meat, dairy, oils, and diseased plants.

In just 2-3 months, your waste transforms into black gold for gardens.`,
    keyMessage: 'Composting reduces methane emissions and creates nutrient-rich soil for plants.',
    reflection:
      'How much of your household waste is food scraps? Could you start a small compost bin, even on a balcony?',
    facts: [
      'Food waste generates 8% of global greenhouse gas emissions',
      'Composting can divert 30% of household waste from landfills',
      'Compost improves soil water retention by up to 20%',
      'Methane from landfills is 80x more potent than CO₂',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What percentage of greenhouse gas emissions does food waste generate?',
        options: ['2%', '5%', '8%', '12%'],
        correctIndex: 2,
        explanation: 'Food waste is responsible for approximately 8% of global greenhouse gas emissions.',
      },
      {
        type: 'true-false',
        question: 'Meat and dairy can be safely composted in a home compost bin.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Meat, dairy, and oily foods should not go in a home compost — they attract pests and create odors. Stick to fruit/vegetable scraps, coffee grounds, and paper.',
      },
      {
        type: 'multiple-choice',
        question: 'How much more potent than CO₂ is methane over 20 years?',
        options: ['10x', '30x', '80x', '200x'],
        correctIndex: 2,
        explanation: 'Methane, produced when food waste decomposes in landfills without oxygen, is 80 times more potent than CO₂ over a 20-year period.',
      },
    ],
  },
  '5': {
    day: 5,
    title: 'The Circular Economy',
    icon: '♻️',
    story: `Our current economy is largely linear: take resources, make products, throw them away. This "cradle to grave" model generates enormous waste and depletes finite resources.

The circular economy reimagines this: materials stay in use for as long as possible, waste is minimized, and products are designed to be repaired, refurbished, and recycled — "cradle to cradle."

A circular economy model could generate $4.5 trillion in economic benefits by 2030. Countries like the Netherlands and Germany are already transitioning. Sri Lanka's "Pilisaru" national solid waste management project is a step in this direction.

Recycling is just one part. The full hierarchy is: Refuse → Reduce → Reuse → Repair → Refurbish → Recycle → Recover → Rot (compost).

Every time you choose a reusable bag, repair instead of replace, or buy second-hand, you're participating in the circular economy.`,
    keyMessage: 'A circular economy keeps materials in use longer, reducing waste and resource extraction.',
    reflection:
      'What is one thing you regularly throw away that could instead be repaired, repurposed, or bought second-hand?',
    facts: [
      'The circular economy could generate $4.5 trillion by 2030',
      'Recycling creates 10x more jobs per tonne than landfilling',
      'Recycled aluminum uses 95% less energy than virgin aluminum',
      'The EU circular economy action plan targets 70% recycling by 2030',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What economic benefit could a circular economy generate by 2030?',
        options: ['$1 trillion', '$2.5 trillion', '$4.5 trillion', '$8 trillion'],
        correctIndex: 2,
        explanation: 'Transitioning to a circular economy model could generate $4.5 trillion in economic benefits by 2030.',
      },
      {
        type: 'true-false',
        question: 'In a circular economy, recycling is the first and most important step.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Recycling is actually the last resort in the circular economy hierarchy. The full order is: Refuse → Reduce → Reuse → Repair → Refurbish → Recycle.',
      },
      {
        type: 'multiple-choice',
        question: 'What does \'cradle to cradle\' mean?',
        options: ['Products are made from baby materials', 'Products are designed to be perpetually recycled', 'Products are biodegradable', 'Products are cheap to replace'],
        correctIndex: 1,
        explanation: 'Cradle to cradle means designing products so materials never become waste — they cycle back into new products indefinitely.',
      },
    ],
  },
  '6': {
    day: 6,
    title: 'Glass Recycling',
    icon: '🍶',
    story: `Glass is one of the most remarkable materials humans have ever created. Unlike plastic, glass can be recycled endlessly — 100% of a glass bottle can be melted down and reformed into a new bottle without any loss of quality or purity.

In Sri Lanka, glass bottles from arrack, beer, soft drinks, and condiments make up a significant portion of household waste. Yet much of this ends up in landfills where glass, though inert, occupies valuable space for thousands of years.

The environmental case for glass recycling is compelling. Recycling just one glass bottle saves enough energy to power a computer for 25 minutes. Manufacturing new glass from recycled cullet (crushed glass) uses 30% less energy than making it from raw materials like sand, soda ash, and limestone.

Sri Lanka's informal glass collection network — the familiar "kalagedi" vendors who call through neighbourhoods — has long been a backbone of glass recovery. These entrepreneurs buy glass bottles from households and sell them to manufacturers and recyclers.

You can help by rinsing glass containers, removing caps and lids, and keeping glass separate from other recyclables. Broken glass should be wrapped safely before disposal to protect waste workers.`,
    keyMessage: 'Glass is 100% recyclable and can be melted and reformed indefinitely without quality loss.',
    reflection:
      'How many glass containers does your household go through in a week? Do you currently separate them for recycling or the kalagedi vendor?',
    facts: [
      'Glass can be recycled endlessly with no quality degradation',
      'Recycling one glass bottle saves energy to power a 100W bulb for 4 hours',
      'Glass takes over 1 million years to decompose naturally in a landfill',
      'Making glass from recycled cullet uses 30% less energy than virgin materials',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How many times can glass be recycled?',
        options: ['3 times', '10 times', 'Infinitely', '5 times'],
        correctIndex: 2,
        explanation: 'Unlike paper or plastic, glass can be recycled infinitely without any loss in quality or purity.',
      },
      {
        type: 'true-false',
        question: 'Recycling glass saves energy compared to making new glass.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'Recycling glass uses about 40% less energy than producing new glass from raw materials like sand and limestone.',
      },
      {
        type: 'multiple-choice',
        question: 'What color of glass is most commonly recycled?',
        options: ['Blue', 'Green', 'Clear/Flint', 'Brown/Amber'],
        correctIndex: 2,
        explanation: 'Clear (flint) glass is the most commonly recycled because it\'s the most versatile — it can be remelted into any color.',
      },
    ],
  },
  '7': {
    day: 7,
    title: 'Metal & Aluminum',
    icon: '🥫',
    story: `Aluminum is extraordinary. It takes enormous energy to extract aluminum from bauxite ore — the smelting process uses more electricity per tonne than almost any other industrial process. Yet recycling aluminum uses only 5% of that energy. That's a 95% energy saving for every can you recycle.

A recycled aluminum can goes from the recycling bin back onto a supermarket shelf in as little as 60 days. This closed loop is one of the most efficient material recovery systems in existence.

In Sri Lanka, metal collection and recycling has deep roots. Scrap metal dealers operate in most towns and cities, purchasing everything from old iron pipes to copper wire and aluminum cans. This informal economy has long kept metals out of landfills — driven by financial incentive rather than environmental awareness.

Steel is also highly recyclable. Steel cans (for canned fish, coconut milk, condensed milk — staples of the Sri Lankan kitchen) are made with up to 25% recycled content and can be recycled repeatedly.

When you save your aluminum cans and steel tins for recycling, you're participating in one of the most energy-efficient loops in the materials economy.`,
    keyMessage: 'Recycling aluminum saves 95% of the energy required to produce it from raw ore.',
    reflection:
      'How many metal cans does your household use each week? Is there a local scrap dealer or collection point near you?',
    facts: [
      'Recycling aluminum saves 95% of the energy vs. virgin production',
      'An aluminum can can be recycled and back on the shelf in 60 days',
      'Sri Lanka produces thousands of tonnes of scrap metal annually',
      'Steel is the most recycled material in the world by weight',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How much energy does recycling aluminum save vs. virgin production?',
        options: ['50%', '70%', '85%', '95%'],
        correctIndex: 3,
        explanation: 'Recycling aluminum saves an astounding 95% of the energy required to produce it from raw bauxite ore.',
      },
      {
        type: 'true-false',
        question: 'Steel is the most recycled material in the world by weight.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'Steel is the world\'s most recycled material — more steel is recycled each year than all other materials combined.',
      },
      {
        type: 'multiple-choice',
        question: 'An aluminum can recycled today could be back on the shelf in:',
        options: ['1 week', '60 days', '6 months', '1 year'],
        correctIndex: 1,
        explanation: 'Aluminum is one of the fastest-cycling recyclables — a can recycled today can be back on the shelf as a new can in as little as 60 days.',
      },
    ],
  },
  '8': {
    day: 8,
    title: 'Textile Waste',
    icon: '👗',
    story: `Fashion is one of the world's most polluting industries. The rise of "fast fashion" — cheap, trendy clothing designed to be worn a few times and discarded — has created a global textile waste crisis. Globally, 92 million tonnes of textile waste is generated each year.

Most textile waste ends up in landfills. Synthetic fabrics like polyester and nylon are derived from petroleum and take decades to break down, releasing microplastics as they do.

Sri Lanka has a unique relationship with textiles. As a major garment exporter, the country's factories produce billions of garments annually for global brands. This also means Sri Lanka generates significant factory off-cuts and deadstock fabric. Organizations like Reusit and local tailors repurpose these scraps creatively.

For consumers, the most impactful actions are: buy less and buy better, donate wearable clothing to second-hand shops or neighbours, repurpose worn textiles as cleaning rags, and look for textile collection points when clothes are truly beyond use.

In Colombo and Kandy, several organizations now accept donated clothing. Even tattered textiles can be downcycled into industrial rags, insulation, or filling material.`,
    keyMessage: 'Donating or repurposing one garment keeps it from contributing to the 92 million tonnes of annual textile waste.',
    reflection:
      'When you last decluttered your wardrobe, where did the clothes go? Is there a better destination you could choose next time?',
    facts: [
      '92 million tonnes of textile waste is generated globally each year',
      'The fashion industry produces 10% of global CO₂ emissions',
      'A single polyester shirt can release 700,000 microplastics per wash',
      'Extending a garment\'s life by 9 months reduces its carbon footprint by 30%',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How many kilograms of clothing does the average person discard per year?',
        options: ['5 kg', '12 kg', '20 kg', '35 kg'],
        correctIndex: 1,
        explanation: 'On average, each person discards about 12 kilograms of clothing per year, most of which ends up in landfills.',
      },
      {
        type: 'true-false',
        question: 'Synthetic fabrics like polyester are easy to recycle.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Synthetic fabrics are notoriously difficult to recycle. They\'re made from plastic polymers and often blended with natural fibers, making separation challenging.',
      },
      {
        type: 'multiple-choice',
        question: 'What is the most eco-friendly first step for unwanted clothing?',
        options: ['Throw it away', 'Burn it', 'Donate or swap it', 'Cut it into rags'],
        correctIndex: 2,
        explanation: 'Donating or swapping clothing extends its life and keeps it out of landfill — this is always the preferred option before considering any form of disposal.',
      },
    ],
  },
  '9': {
    day: 9,
    title: 'Hazardous Household Waste',
    icon: '⚠️',
    story: `Not all waste is equal. Some items in your home — batteries, paints, solvents, pesticides, fluorescent bulbs, cleaning chemicals — contain toxic substances that can cause serious harm if they enter the environment or water supply.

These are classified as hazardous household waste (HHW). When thrown into regular waste bins, HHW can contaminate entire landfills and leach toxins into groundwater. A single car battery contains enough lead and acid to contaminate 25,000 litres of water.

In Sri Lanka, awareness of HHW is growing. The Central Environment Authority (CEA) provides guidelines on safe disposal. Some hardware stores and battery retailers accept old batteries for proper recycling. Paint manufacturers occasionally run collection drives.

The safest approach for HHW: never pour chemicals down drains or into soil; store hazardous items separately; look for manufacturer take-back schemes; contact the CEA or local municipality for disposal events.

Lead-acid batteries from vehicles and UPS units are the highest-volume hazardous waste in Sri Lanka. The good news: they command a price at scrap dealers and are almost universally collected and recycled.`,
    keyMessage: 'One car battery contains enough toxins to contaminate 25,000 litres of groundwater if improperly disposed of.',
    reflection:
      'What hazardous items are currently in your home — batteries, old paint, pesticides? Do you know how to dispose of them safely?',
    facts: [
      'One car battery can contaminate 25,000 litres of water',
      'Fluorescent bulbs contain mercury — never break or bin without care',
      'Sri Lanka\'s CEA provides HHW disposal guidance and events',
      'Lead-acid batteries are 99% recyclable and have real scrap value',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'Where should old batteries be disposed of?',
        options: ['General trash', 'Recycling bin', 'Designated battery collection points', 'Down the drain'],
        correctIndex: 2,
        explanation: 'Batteries contain heavy metals like mercury, lead, and cadmium. They must go to designated battery collection points, not general waste.',
      },
      {
        type: 'true-false',
        question: 'Fluorescent light bulbs can be safely thrown in the general trash.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Fluorescent bulbs contain mercury vapor. They must be taken to hazardous waste collection points or hardware stores that accept them.',
      },
      {
        type: 'multiple-choice',
        question: 'Which common household product is considered hazardous waste?',
        options: ['Cardboard boxes', 'Plastic bottles', 'Paint cans', 'Newspapers'],
        correctIndex: 2,
        explanation: 'Leftover paint is classified as hazardous household waste. It should be taken to a hazardous waste collection event, never poured down drains.',
      },
    ],
  },
  '10': {
    day: 10,
    title: 'Ocean Plastic',
    icon: '🌊',
    story: `Sri Lanka sits at the heart of the Indian Ocean, with over 1,600 km of coastline. The country's beaches — from Mirissa to Trincomalee — are among the most beautiful in Asia. Yet plastic waste threatens this natural heritage every day.

It is estimated that Sri Lanka is one of the top contributors to ocean plastic, partly due to inadequate waste collection in coastal areas where waste enters rivers and drains that flow directly to the sea. Plastic bags, bottles, and packaging are carried by monsoon rains from streets and open dumps into waterways and ultimately the ocean.

The impact on marine life is devastating. Sea turtles mistake plastic bags for jellyfish. Whales wash ashore with stomachs full of plastic. Seabirds feed plastic fragments to their chicks. Microplastics have been found in Sri Lankan fish sold in markets.

But change is happening. Volunteer beach cleanups — organized by groups like EcoTeam Sri Lanka and CCC — take place monthly along the southern and western coasts. The "Blue Communities" initiative in coastal villages teaches waste separation at source.

Every piece of plastic that doesn't make it to a bin has a chance of reaching the ocean. Every piece you properly dispose of or recycle is one less threat to marine wildlife.`,
    keyMessage: 'Sri Lanka\'s coastlines are on the front line of ocean plastic — proper waste disposal protects our seas and wildlife.',
    reflection:
      'Have you visited a Sri Lankan beach recently? What did you notice about plastic waste? Could you join or organize a local cleanup?',
    facts: [
      '8 million tonnes of plastic enter the world\'s oceans every year',
      'Sri Lanka ranks among top ocean plastic contributors in Asia',
      'Over 1 million seabirds and 100,000 marine mammals die from plastic annually',
      'Microplastics have been found in fish sold in Sri Lankan markets',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How many tonnes of plastic enter our oceans each year?',
        options: ['1 million', '8 million', '20 million', '50 million'],
        correctIndex: 1,
        explanation: 'Approximately 8 million tonnes of plastic enter our oceans every year — equivalent to dumping a garbage truck\'s worth every minute.',
      },
      {
        type: 'true-false',
        question: 'Microplastics have been found in human blood.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'A 2022 study published in Environment International found microplastics in the bloodstream of 77% of people tested — a disturbing indicator of plastic pollution\'s reach.',
      },
      {
        type: 'multiple-choice',
        question: 'What is \'ghost fishing\'?',
        options: ['Fishing at night', 'Abandoned fishing gear continuing to trap marine life', 'Fishing in protected waters', 'Using invisible fishing line'],
        correctIndex: 1,
        explanation: 'Ghost fishing refers to the phenomenon of lost or abandoned fishing nets and gear that continue to trap and kill marine animals for years.',
      },
    ],
  },
  '11': {
    day: 11,
    title: 'Climate Change & Waste',
    icon: '🌡️',
    story: `Climate change is the defining challenge of our era. While energy and transport dominate the headlines, waste management contributes approximately 5% of global greenhouse gas emissions — more than the entire aviation industry.

The link between waste and climate is direct. When organic waste like food and garden material decomposes in oxygen-deprived landfills, it produces methane — a greenhouse gas with 80 times the warming power of CO₂ over 20 years. Burning waste releases CO₂ and black carbon. Even manufacturing products from virgin materials (rather than recycled ones) generates far more emissions.

Sri Lanka, like many tropical countries, is highly vulnerable to climate change impacts: more intense monsoons, sea level rise threatening coastal communities, and extreme heat stressing agriculture. The country has committed to reaching carbon neutrality by 2050.

Waste reduction is one of the most accessible climate actions for individuals. By recycling, composting, and reducing waste generation, you directly cut the methane and CO₂ from landfills, reduce the need for energy-intensive virgin material production, and demonstrate the consumer demand for circular systems.

Your daily eco-habits are climate action.`,
    keyMessage: 'Waste management accounts for 5% of global greenhouse gas emissions — reducing waste is direct climate action.',
    reflection:
      'When you think about your personal carbon footprint, do you consider your waste habits? Which area of waste has the biggest climate impact for your household?',
    facts: [
      'Waste contributes approximately 5% of global greenhouse gas emissions',
      'Landfill methane is 80x more warming than CO₂ over 20 years',
      'Composting food waste can prevent 0.6 tonnes of CO₂e per tonne of food',
      'Sri Lanka has committed to carbon neutrality by 2050',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What percentage of global greenhouse gas emissions does waste management contribute?',
        options: ['2%', '5%', '10%', '15%'],
        correctIndex: 1,
        explanation: 'Waste management contributes approximately 5% of global greenhouse gas emissions — more than the entire aviation industry.',
      },
      {
        type: 'true-false',
        question: 'Reducing waste is a direct form of climate action.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'Waste management accounts for 5% of global greenhouse gas emissions — by recycling, composting, and reducing waste, you directly cut methane and CO₂ from landfills.',
      },
      {
        type: 'multiple-choice',
        question: 'What year has Sri Lanka committed to carbon neutrality?',
        options: ['2030', '2040', '2050', '2060'],
        correctIndex: 2,
        explanation: 'Sri Lanka has committed to reaching carbon neutrality by 2050, and waste reduction is one of the most accessible ways individuals can contribute.',
      },
    ],
  },
  '12': {
    day: 12,
    title: 'Food Waste Economics',
    icon: '🍱',
    story: `Every year, one third of all food produced for human consumption is lost or wasted. In economic terms, this amounts to $1 trillion in value destroyed annually — more than the GDP of most countries.

In Sri Lanka, food waste is a significant challenge. Estimates suggest that 40-60% of the food produced in Sri Lanka is wasted across the supply chain — from post-harvest losses on farms, to spoilage in transport, to household over-purchasing and over-cooking. This happens even as a significant portion of the population faces food insecurity.

The economics are stark: wasted food represents wasted water (agriculture uses 70% of global freshwater), wasted farmland, wasted labor, and wasted energy in transport and refrigeration. Then that wasted food goes to landfill and generates more emissions.

But the reverse is also true: reducing food waste creates economic value. Hotels, restaurants, and households that track and reduce food waste save money. Surplus food redistribution organizations in Colombo — connecting restaurants and supermarkets with food banks — are demonstrating this in practice.

At home, meal planning, buying what you need, storing food properly, and composting what can't be used are the four pillars of food waste reduction.`,
    keyMessage: '$1 trillion in food is wasted globally each year — and it all ends up generating landfill emissions.',
    reflection:
      'How much food does your household throw away in a typical week? What causes most of your food waste, and what\'s one change you could make?',
    facts: [
      '1/3 of all food produced globally is wasted — $1 trillion in value',
      'Sri Lanka wastes an estimated 40-60% of food across the supply chain',
      'Food waste uses 25% of the world\'s freshwater supply needlessly',
      'Reducing food waste is one of the highest-impact climate actions available',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What percentage of all food produced globally is wasted?',
        options: ['10%', '20%', '33%', '50%'],
        correctIndex: 2,
        explanation: 'One third (33%) of all food produced for human consumption is lost or wasted globally, amounting to $1 trillion in value annually.',
      },
      {
        type: 'true-false',
        question: 'Wasted food only affects our food system, not our climate.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: '$1 trillion in food is wasted globally each year — and it all ends up generating landfill emissions through methane production.',
      },
      {
        type: 'multiple-choice',
        question: 'Which is NOT one of the four pillars of home food waste reduction?',
        options: ['Meal planning', 'Buying what you need', 'Storing food properly', 'Always buying in bulk'],
        correctIndex: 3,
        explanation: 'The four pillars are: meal planning, buying what you need, storing food properly, and composting what can\'t be used. Buying in bulk can sometimes lead to more waste.',
      },
    ],
  },
  '13': {
    day: 13,
    title: 'Upcycling & Creativity',
    icon: '🎨',
    story: `Upcycling is the art of taking something destined for the bin and transforming it into something of greater value. Unlike recycling, which breaks materials down to their raw form, upcycling keeps the object largely intact — adding creativity, craftsmanship, and new purpose.

Sri Lanka has a rich tradition of creative reuse. In villages across the island, used cement sacks become seed-raising bags, rubber tyres become garden planters, coconut shells become bowls and spoons, and old saris become quilts. This wasn't called "upcycling" — it was simply the resourceful way of life.

Today, Sri Lankan artisans and entrepreneurs are formalizing this into businesses. Craftspeople in Colombo create fashion accessories from recycled bicycle inner tubes. Artists in Kandy make sculptures from discarded electronics. Social enterprises train women in upcycled fabric crafts.

Globally, upcycling has become a design movement. Brands like Freitag (bags from truck tarps) and Patagonia (jackets from recycled bottles) have built major businesses on the concept. But at its heart, upcycling is simply a creative mindset: seeing possibility where others see waste.

The best upcycling project is one you make yourself. A jam jar becomes a vase. A wooden pallet becomes a bookshelf. Worn denim becomes a bag.`,
    keyMessage: 'Upcycling transforms waste into something of greater value — creativity is the most powerful recycling tool.',
    reflection:
      'Look around your home. What items are you about to throw away that could instead be creatively repurposed? What would you make?',
    facts: [
      'Upcycling creates items of higher value than the original, unlike downcycling',
      'Sri Lanka\'s traditional crafts were built on creative reuse for centuries',
      'The global upcycled fashion market is worth over $7 billion',
      'Upcycling one glass jar saves the energy needed to power a TV for 1.5 hours',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How much is the global upcycled fashion market worth?',
        options: ['$1 billion', '$3 billion', '$7 billion', '$15 billion'],
        correctIndex: 2,
        explanation: 'The global upcycled fashion market is worth over $7 billion, showing that creativity and sustainability can be commercially successful.',
      },
      {
        type: 'true-false',
        question: 'Upcycling and recycling are the same process.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Upcycling keeps the object largely intact and adds value — unlike recycling which breaks materials down to raw form. Creativity is the most powerful recycling tool.',
      },
      {
        type: 'multiple-choice',
        question: 'Which traditional Sri Lankan practice is an example of upcycling?',
        options: ['Buying new products', 'Making bowls from coconut shells', 'Landfilling old materials', 'Importing recycled goods'],
        correctIndex: 1,
        explanation: 'In Sri Lanka, coconut shells become bowls and spoons, rubber tyres become garden planters, and old saris become quilts — these are classic examples of upcycling.',
      },
    ],
  },
  '14': {
    day: 14,
    title: 'Corporate Responsibility',
    icon: '🏢',
    story: `While individual action matters enormously, the scale of the waste crisis demands systemic change. Corporations that design, manufacture, and sell products are responsible for the packaging and materials they put into the world.

Extended Producer Responsibility (EPR) is a policy approach that holds manufacturers financially and operationally responsible for the end-of-life management of their products. Under EPR schemes, companies must fund recycling infrastructure, take back products, or meet recycling targets — or pay fees that fund public collection systems.

In Sri Lanka, EPR legislation is in development. The National EPR Framework being developed by the CEA would require major plastic packagers to contribute to collection and recycling. This mirrors successful programs in Europe, where beverage companies fund bottle deposit return schemes.

Internationally, large brands are under growing pressure from consumers and regulators. Coca-Cola, Nestlé, and Unilever — consistently named as top plastic polluters in global beach clean audits — have made pledges on recycled content and packaging reduction, though progress has been criticized as insufficient.

As a consumer, you hold power: buying from brands with strong environmental practices, avoiding single-use packaging where possible, and supporting EPR advocacy sends market signals that companies cannot ignore.`,
    keyMessage: 'Corporations that create packaging must be held responsible for its end-of-life — EPR laws make this happen.',
    reflection:
      'Think about the brands you buy most often. Do you know their environmental commitments? Would it change your purchasing decisions?',
    facts: [
      'Just 20 companies produce 55% of all single-use plastic waste globally',
      'EPR policies in Europe have driven packaging recycling rates above 70%',
      'Sri Lanka\'s CEA is developing an Extended Producer Responsibility framework',
      'Consumer pressure has led 400+ companies to make plastic reduction pledges',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What percentage of single-use plastic waste do just 20 companies produce?',
        options: ['20%', '35%', '55%', '80%'],
        correctIndex: 2,
        explanation: 'Just 20 companies produce 55% of all single-use plastic waste globally, showing that corporate accountability is essential to solving the plastic crisis.',
      },
      {
        type: 'true-false',
        question: 'Individual consumer choices have no impact on corporate environmental behavior.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Corporations that create packaging must be held responsible — and consumer pressure has already led 400+ companies to make plastic reduction pledges.',
      },
      {
        type: 'multiple-choice',
        question: 'What does EPR stand for?',
        options: ['Extended Product Regulations', 'Environmental Protection Requirements', 'Extended Producer Responsibility', 'Eco-Packaging Reform'],
        correctIndex: 2,
        explanation: 'EPR stands for Extended Producer Responsibility — a policy approach that holds manufacturers financially responsible for the end-of-life management of their products.',
      },
    ],
  },
  '15': {
    day: 15,
    title: 'Zero Waste Lifestyle',
    icon: '🌿',
    story: `"Zero waste" sounds impossible — and taken literally, it is. But as a philosophy and aspiration, zero waste has inspired a global movement of people dramatically reducing what they send to landfill. The goal is not perfection: it is direction.

The Zero Waste hierarchy, also called the 5Rs, offers a framework: Refuse (say no to things you don't need), Reduce (buy less, use less), Reuse (choose durable over disposable), Recycle (when reduction and reuse are exhausted), and Rot (compost organic material).

Zero waste families in the West famously fit a year's trash into a mason jar. In Sri Lanka, many traditional households already practiced zero waste by necessity: nothing was wasted, everything had a second use, neighbors shared tools, and food scraps fed animals or composted.

The modern zero waste movement reconnects with this wisdom. Bulk buying using reusable containers, package-free shopping in local markets (Sri Lanka's traditional "pola" markets are inherently low-waste), carrying a reusable bottle and bag, and meal planning to eliminate food waste are the building blocks.

Zero waste is not a certification to achieve — it is a daily practice. Each small refusal of unnecessary plastic, each repaired garment, each composted food scrap adds up to meaningful impact.`,
    keyMessage: 'Zero waste is a direction, not a destination — the 5Rs (Refuse, Reduce, Reuse, Recycle, Rot) are your guide.',
    reflection:
      'Which of the 5Rs — Refuse, Reduce, Reuse, Recycle, or Rot — do you already practice? Which is the biggest opportunity for you?',
    facts: [
      'The average person generates 4 lbs (1.8 kg) of waste per day',
      'Zero waste households typically divert over 90% of waste from landfill',
      'Sri Lanka\'s traditional pola markets are naturally low-waste shopping environments',
      'The 5Rs hierarchy reduces waste more effectively than recycling alone',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How much waste does the average person generate per day?',
        options: ['0.5 kg', '1.8 kg', '3 kg', '5 kg'],
        correctIndex: 1,
        explanation: 'The average person generates about 4 lbs (1.8 kg) of waste per day. Zero waste households can divert over 90% of this from landfill.',
      },
      {
        type: 'true-false',
        question: 'Zero waste means producing absolutely no waste whatsoever.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Zero waste is a direction, not a destination — the 5Rs (Refuse, Reduce, Reuse, Recycle, Rot) are your guide, not perfection.',
      },
      {
        type: 'multiple-choice',
        question: 'What is the FIRST step in the zero waste 5Rs hierarchy?',
        options: ['Recycle', 'Reduce', 'Refuse', 'Reuse'],
        correctIndex: 2,
        explanation: 'The Zero Waste hierarchy starts with Refuse — saying no to things you don\'t need. This is the most effective step because it prevents waste from being created at all.',
      },
    ],
  },
  '16': {
    day: 16,
    title: 'Biodegradable vs Compostable',
    icon: '🌱',
    story: `"Biodegradable" and "compostable" are two of the most misunderstood terms in sustainable packaging. Both sound eco-friendly, but their actual environmental impact depends enormously on conditions and context.

Biodegradable simply means a material can break down through biological processes. But it says nothing about how long this takes or what it breaks down into. Some "biodegradable" plastics require UV light, high temperatures, and specific bacteria — conditions rarely found in a home or landfill. In the ocean, many "biodegradable" plastics persist for years, fragmenting into microplastics.

Compostable means a material will fully break down under industrial composting conditions (high heat, specific humidity) within a defined timeframe — typically 90-180 days — leaving no harmful residue. Home compostable products can break down in backyard conditions, though more slowly.

The key problem: many compostable products go into regular waste bins and landfills, where they break down anaerobically and release methane — exactly like conventional plastic or food waste.

In Sri Lanka, composting infrastructure is limited outside of home composting. Unless a compostable product can be processed in Sri Lanka's conditions, "compostable" may be greenwashing. The most honest environmental choice is often to choose less packaging overall.`,
    keyMessage: '"Biodegradable" doesn\'t mean eco-safe — always check if Sri Lanka has the infrastructure to actually process it.',
    reflection:
      'Have you bought products labelled "biodegradable" or "compostable"? Where did that packaging end up? Could you find alternatives with less packaging overall?',
    facts: [
      '"Biodegradable" plastic can still take decades to break down in landfills',
      'Compostable packaging requires industrial composting to break down properly',
      'In landfills, compostable items generate methane just like organic waste',
      'Less packaging is almost always better than "eco-friendly" packaging',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How long can "biodegradable" plastic take to break down in a landfill?',
        options: ['A few days', 'A few months', 'Several years to decades', 'It never breaks down'],
        correctIndex: 2,
        explanation: '"Biodegradable" plastic can still take decades to break down in landfills — the label doesn\'t guarantee eco-safety.',
      },
      {
        type: 'true-false',
        question: '"Compostable" packaging is always the most eco-friendly choice.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: '"Biodegradable" doesn\'t mean eco-safe — always check if Sri Lanka has the infrastructure to process it. Less packaging is almost always better than "eco-friendly" packaging.',
      },
      {
        type: 'multiple-choice',
        question: 'What happens to compostable packaging in a landfill?',
        options: ['It breaks down cleanly', 'It generates methane', 'It disappears quickly', 'It becomes fertilizer'],
        correctIndex: 1,
        explanation: 'In landfills, compostable items decompose anaerobically and generate methane — exactly like conventional plastic or food waste.',
      },
    ],
  },
  '17': {
    day: 17,
    title: 'Water & Waste Connection',
    icon: '💧',
    story: `Water and waste are inseparably linked. Improper waste disposal is one of the most significant threats to clean water access in Sri Lanka and across the developing world.

When waste is dumped in open areas near rivers and streams — as is common in many parts of Sri Lanka — rain washes pollutants into waterways. Plastic fragments clog drainage systems, causing flooding during monsoons. Chemical waste from industries and households seeps into groundwater, contaminating wells that rural communities depend on.

Sri Lanka faces a particular challenge: the Kelani River, the source of drinking water for over half of Colombo's population, is heavily polluted with municipal waste and industrial discharge. Seasonal flooding spreads this contamination across low-lying areas.

But the connection between waste and water is also positive. Composting instead of landfilling reduces leachate — the toxic liquid that forms when waste decomposes and mixes with rainwater in landfills. Recycling reduces the demand for water-intensive virgin material production. Keeping plastic out of drains keeps storm water systems functioning.

Access to clean water is a human right. Responsible waste management is one of the most direct ways to protect it.`,
    keyMessage: 'Proper waste disposal protects clean water — plastic in drains causes flooding, and landfill leachate contaminates wells.',
    reflection:
      'Where does your household\'s drinking water come from? Do you know if industrial or household waste disposal in your area poses a risk to water sources?',
    facts: [
      '80% of the world\'s wastewater is discharged untreated into water bodies',
      'Kelani River — Colombo\'s main water source — faces significant waste pollution',
      'Plastic in urban drains contributes to flooding during Sri Lanka\'s monsoons',
      'Landfill leachate can contaminate groundwater with toxic heavy metals',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What percentage of the world\'s wastewater is discharged untreated?',
        options: ['30%', '50%', '80%', '100%'],
        correctIndex: 2,
        explanation: '80% of the world\'s wastewater is discharged untreated into water bodies, making proper waste management critical for clean water access.',
      },
      {
        type: 'true-false',
        question: 'Plastic in drains has no effect on flooding during monsoons.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Proper waste disposal protects clean water — plastic in drains causes flooding during Sri Lanka\'s monsoons, and landfill leachate contaminates wells.',
      },
      {
        type: 'multiple-choice',
        question: 'What is "leachate"?',
        options: ['A type of compost', 'Toxic liquid from decomposing landfill waste', 'Clean water from rivers', 'A recycling chemical'],
        correctIndex: 1,
        explanation: 'Leachate is the toxic liquid that forms when waste decomposes and mixes with rainwater in landfills. It can contaminate groundwater with heavy metals.',
      },
    ],
  },
  '18': {
    day: 18,
    title: 'Wildlife & Waste',
    icon: '🐘',
    story: `Sri Lanka is one of the most biodiverse nations on Earth per unit area. Its elephants, leopards, sea turtles, blue whales, and hundreds of endemic bird species draw nature lovers from across the globe. Yet waste poses an escalating threat to this natural heritage.

Elephants in and around Ampara and Polonnaruwa raid open dump sites, ingesting plastic bags and packaging that cause intestinal blockages and death. Dozens of elephant deaths in Sri Lanka have been attributed to consuming plastic waste at open dumps.

Sri Lanka's five species of sea turtles — including the critically endangered Leatherback — regularly consume plastic bags mistaken for jellyfish. Nesting beaches at Rekawa and Kosgoda are littered with plastic that entangles hatchlings.

Plastic pollution affects every layer of Sri Lanka's ecosystems. Fish in coral reefs ingest microplastics. Monkeys in Sinharaja receive rubbish from tourists. Even endemic birds incorporate plastic fragments into their nests.

The good news: wildlife rescue and anti-poaching groups across Sri Lanka are connecting environmental awareness with waste action. Protecting elephants means keeping plastics out of their habitat. Protecting turtles means keeping beaches clean.

Every piece of plastic you keep out of the environment is a step toward protecting Sri Lanka's extraordinary wildlife.`,
    keyMessage: 'Dozens of Sri Lankan elephants have died from ingesting plastic waste at open dump sites — wildlife protection and waste management are the same cause.',
    reflection:
      'Have you seen wildlife affected by waste — birds in fishing line, turtles with plastic, animals at dumps? What feeling did that create, and how does it motivate you?',
    facts: [
      'Dozens of Sri Lankan elephants have died from consuming plastic at open dumps',
      'Sri Lanka\'s five sea turtle species all face plastic pollution threats',
      'Over 700 marine species are threatened by ocean plastic globally',
      'Microplastics have been found in 73% of fish caught in the Indian Ocean',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How many marine species are threatened by ocean plastic globally?',
        options: ['Over 100', 'Over 300', 'Over 700', 'Over 1,000'],
        correctIndex: 2,
        explanation: 'Over 700 marine species are threatened by ocean plastic globally — from sea turtles mistaking bags for jellyfish to fish ingesting microplastics.',
      },
      {
        type: 'true-false',
        question: 'Wildlife protection and waste management are unrelated causes.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Dozens of Sri Lankan elephants have died from ingesting plastic waste at open dump sites — wildlife protection and waste management are the same cause.',
      },
      {
        type: 'multiple-choice',
        question: 'Why do sea turtles consume plastic bags?',
        options: ['They are attracted to the color', 'They mistake them for jellyfish', 'They need the minerals', 'They are confused by the smell'],
        correctIndex: 1,
        explanation: 'Sea turtles mistake plastic bags for jellyfish — one of their primary food sources. This causes intestinal blockages and often death.',
      },
    ],
  },
  '19': {
    day: 19,
    title: 'Community Clean-up Culture',
    icon: '🤝',
    story: `No individual action changes the landscape of a community — but collective action does. Across Sri Lanka and the world, community-led clean-ups are transforming polluted streets, rivers, beaches, and forest edges into spaces communities can be proud of.

Shramadana — the Sinhalese concept of contributing one's labor voluntarily to community benefit — has deep roots in Sri Lankan culture. Organized Shramadana events have cleared drains before monsoons, beautified village roadsides, and restored temple grounds for centuries.

Modern environmental clean-ups build on this tradition. Monthly beach clean-ups at Galle Face, Negombo, and Mirissa attract hundreds of volunteers. River clean-ups in the Kelani and Mahaweli catchments remove tonnes of waste annually. School groups, corporate teams, and community organizations increasingly participate.

Internationally, plogging — picking up litter while jogging — has become a global phenomenon, combining fitness with environmental action. The #trashtag challenge on social media turned litter picking into a viral movement.

Community clean-ups do more than remove waste: they build civic pride, demonstrate that pollution is unacceptable, inspire individuals to change their own disposal habits, and create social networks of environmentally aware citizens.

You don't need a formal organization to start a clean-up. Three friends, a few bags, and an hour in a local park or on a beach is enough.`,
    keyMessage: 'Shramadana — Sri Lanka\'s tradition of voluntary community labor — is the foundation for a clean environment.',
    reflection:
      'Have you ever participated in a community clean-up? If not, what has held you back? What would it take for you to organize or join one?',
    facts: [
      'Shramadana is a centuries-old Sri Lankan tradition of voluntary community labor',
      'The #trashtag challenge generated 100,000+ clean-up posts in one month globally',
      'Sri Lanka\'s monthly beach clean-ups collect hundreds of bags of waste per event',
      'Community clean-ups reduce waste and build the social norms that prevent littering',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How many clean-up posts did the #trashtag challenge generate in one month?',
        options: ['10,000+', '50,000+', '100,000+', '1,000,000+'],
        correctIndex: 2,
        explanation: 'The #trashtag challenge on social media generated 100,000+ clean-up posts in just one month, turning litter picking into a global viral movement.',
      },
      {
        type: 'true-false',
        question: 'Community clean-ups only remove waste — they don\'t change community attitudes.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Shramadana — Sri Lanka\'s tradition of voluntary community labor — is the foundation for a clean environment. Clean-ups also build civic pride and social norms that prevent littering.',
      },
      {
        type: 'multiple-choice',
        question: 'What is "plogging"?',
        options: ['A type of composting', 'Picking up litter while jogging', 'A recycling competition', 'Traditional Sri Lankan farming'],
        correctIndex: 1,
        explanation: 'Plogging — picking up litter while jogging — has become a global phenomenon, combining fitness with environmental action.',
      },
    ],
  },
  '20': {
    day: 20,
    title: 'Schools & Education',
    icon: '📚',
    story: `The most powerful force for long-term environmental change is education. Children who learn to sort waste, compost, and conserve resources grow into adults who maintain these habits — and pass them to their own children. Education multiplies impact across generations.

In Sri Lanka, environmental education has been part of the national curriculum at various levels. The National Environment Act recognizes environmental awareness as a priority. The Ministry of Environment has developed eco-school programs that turn schools into models of sustainability.

Some Sri Lankan schools have established remarkable programs. Eco-clubs maintain school gardens and compost bins, organize clean-up events, and reduce single-use plastic in canteens. Schools that have banned polythene bags on campus have dramatically reduced the waste generated at lunch breaks.

The challenge: many programs remain aspirational or sporadic rather than structural. Consistent daily waste separation, composting, and environmental stewardship require infrastructure, training for teachers, and parental engagement.

International models like Japan's "Soji" — where students clean their own classrooms and school premises daily, with no janitors — demonstrate how school culture can embed environmental responsibility deeply. Sri Lanka's own Shramadana tradition provides a similar cultural foundation.

If you have children in your family, talk to them about what they learn about the environment at school — and share what you're learning through EcoHabit.`,
    keyMessage: 'Environmental education in schools creates lifelong habits — children are multipliers of eco-impact.',
    reflection:
      'Think back to your own school days. What environmental lessons do you remember? How have they shaped your habits? What would you want children to learn that you didn\'t?',
    facts: [
      'Children who learn environmental habits in school maintain them into adulthood',
      'Sri Lanka\'s eco-school programs are in hundreds of schools across the island',
      'Japan\'s daily school cleaning ritual has shaped one of the world\'s cleanest societies',
      'Schools with composting programs divert up to 40% of their waste from landfill',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What percentage of school waste can composting programs divert from landfill?',
        options: ['10%', '20%', '40%', '60%'],
        correctIndex: 2,
        explanation: 'Schools with composting programs can divert up to 40% of their waste from landfill — making them models of sustainability for their communities.',
      },
      {
        type: 'true-false',
        question: 'Environmental habits learned in childhood rarely persist into adulthood.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Environmental education in schools creates lifelong habits — children are multipliers of eco-impact, carrying these habits into adulthood and teaching their own children.',
      },
      {
        type: 'multiple-choice',
        question: 'What is Japan\'s "Soji" practice?',
        options: ['A type of composting', 'Students cleaning their own school daily', 'A recycling game', 'An environmental festival'],
        correctIndex: 1,
        explanation: 'Japan\'s "Soji" is a daily school cleaning ritual where students clean their classrooms and school premises — no janitors needed. It has helped shape one of the world\'s cleanest societies.',
      },
    ],
  },
  '21': {
    day: 21,
    title: 'Government Policy',
    icon: '🏛️',
    story: `Individual action and community initiatives are essential, but lasting environmental change requires the force of law and public policy. Governments set the rules that determine how waste is collected, treated, and recycled at scale.

Sri Lanka has a layered legislative framework for waste management. The National Environment Act (1980, revised multiple times) is the cornerstone. The Waste Management Authority Act created the Pilisaru National Solid Waste Management project. The Central Environment Authority (CEA) enforces environmental regulations and issues permits.

Sri Lanka made international headlines in 2020 by banning several categories of single-use plastic — including polythene bags thinner than 20 microns, straws, and certain food containers. Implementation has been uneven, but the policy signal is clear.

Local governments (Municipal Councils and Pradeshiya Sabhas) are responsible for waste collection. The quality of service varies enormously — from functional daily collection in Colombo to irregular or absent collection in rural areas. Citizens can engage local government through complaints, public comment periods, and community advocacy.

National policies on Extended Producer Responsibility (EPR), waste-to-energy, and compost markets are all in development. Citizens who understand these issues can engage meaningfully: attending public hearings, writing to elected representatives, or joining advocacy organizations.

Policy change is slow but durable. Every individual who understands the law — and holds government and corporations to account — contributes to the systemic change that individual action alone cannot achieve.`,
    keyMessage: 'Sri Lanka\'s 2020 plastic ban shows policy can rapidly change behavior — engaged citizens make policy happen.',
    reflection:
      'How aware are you of the waste laws and policies in your area? Have you ever contacted your local council about waste management? What would you want to advocate for?',
    facts: [
      'Sri Lanka banned single-use polythene bags and straws in 2020',
      'The Central Environment Authority enforces environmental regulations across Sri Lanka',
      'Local Pradeshiya Sabhas are responsible for waste collection in rural areas',
      'EPR policies in the EU have driven packaging recycling above 70%',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What did Sri Lanka ban in 2020?',
        options: ['Glass bottles', 'Aluminum cans', 'Single-use polythene bags and straws', 'Paper bags'],
        correctIndex: 2,
        explanation: 'Sri Lanka made international headlines in 2020 by banning single-use polythene bags, straws, and certain food containers.',
      },
      {
        type: 'true-false',
        question: 'Sri Lanka\'s plastic ban shows that policy cannot rapidly change consumer behavior.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Sri Lanka\'s 2020 plastic ban shows policy can rapidly change behavior — engaged citizens make policy happen by advocating for and enforcing these changes.',
      },
      {
        type: 'multiple-choice',
        question: 'Which body enforces environmental regulations across Sri Lanka?',
        options: ['The Police', 'The Central Environment Authority (CEA)', 'The Ministry of Finance', 'Local Municipal Councils'],
        correctIndex: 1,
        explanation: 'The Central Environment Authority (CEA) enforces environmental regulations, provides guidelines on safe disposal, and issues permits across Sri Lanka.',
      },
    ],
  },
  '22': {
    day: 22,
    title: 'Innovation & Technology',
    icon: '🔬',
    story: `Technology is reshaping waste management in ways that were unimaginable a decade ago. From artificial intelligence sorting recyclables at high speed, to blockchain tracking materials through supply chains, to waste-to-energy plants converting non-recyclable waste into electricity, innovation is creating new possibilities for a circular economy.

Smart bins equipped with sensors monitor fill levels in real time, allowing waste collection fleets to optimize routes and reduce unnecessary pickups — saving fuel, time, and money. Several smart bin pilots have been conducted in Sri Lankan cities.

Waste-to-energy (WtE) technology converts non-recyclable waste into electricity through controlled combustion or gasification. Sri Lanka has explored WtE plants for Colombo's waste crisis — the Karadiyana landfill, receiving over 1,000 tonnes of waste daily, has been the subject of multiple WtE proposals.

Plastic pyrolysis — converting plastic waste back into fuel oil — is emerging as a solution for mixed plastics that cannot be mechanically recycled. Several small-scale pyrolysis operators have started in Sri Lanka.

Biogas digesters convert organic waste into methane for cooking fuel and electricity — a technology with huge potential for Sri Lanka's organic waste stream. Community biogas projects have been piloted in rural areas.

Technology is not a silver bullet — reducing waste at source remains the priority. But for the waste that remains, technology can dramatically reduce its environmental impact.`,
    keyMessage: 'Technology — smart bins, waste-to-energy, plastic pyrolysis — is transforming what\'s possible in waste management.',
    reflection:
      'What waste technology innovation excites you most? Do you think Sri Lanka should prioritize waste-to-energy, advanced recycling, or source reduction?',
    facts: [
      'AI-powered waste sorting systems achieve 99% accuracy, far exceeding manual sorting',
      'Smart bin sensors can reduce unnecessary waste collection trips by 50%',
      'Karadiyana landfill receives 1,000+ tonnes of Colombo\'s waste every day',
      'Biogas from organic waste can replace 30% of household cooking fuel',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How much of household cooking fuel can biogas from organic waste replace?',
        options: ['10%', '20%', '30%', '50%'],
        correctIndex: 2,
        explanation: 'Biogas digesters can convert organic waste into methane for cooking fuel — replacing up to 30% of household cooking fuel needs.',
      },
      {
        type: 'true-false',
        question: 'Technology alone is sufficient to solve the waste crisis without reducing waste at source.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Technology — smart bins, waste-to-energy, plastic pyrolysis — is transforming what\'s possible, but technology is not a silver bullet. Reducing waste at source remains the priority.',
      },
      {
        type: 'multiple-choice',
        question: 'What is plastic pyrolysis?',
        options: ['A type of plastic recycling bin', 'Converting plastic waste back into fuel oil', 'Making plastic from plants', 'A plastic sorting machine'],
        correctIndex: 1,
        explanation: 'Plastic pyrolysis converts plastic waste back into fuel oil — emerging as a solution for mixed plastics that cannot be mechanically recycled.',
      },
    ],
  },
  '23': {
    day: 23,
    title: 'The Informal Economy',
    icon: '🛒',
    story: `In Sri Lanka, as in many countries across the Global South, a vast informal economy underpins much of what gets recycled. The "kalagedi" vendor who cycles through your neighbourhood calling out for glass bottles, the scrap metal dealer who buys old appliances, the paper buyer who takes newspapers by the kilogram — these informal workers collectively divert enormous quantities of material from landfill.

Estimates suggest that informal waste pickers and collectors recover more recyclable material globally than all formal recycling systems combined. In countries like Sri Lanka, this informal sector is the backbone of recycling.

Yet informal waste workers face precarious lives. They lack safe working conditions, social protection, healthcare, and fair prices for the materials they collect. Children sometimes work alongside adults in hazardous conditions. Payment is at the mercy of middlemen and fluctuating commodity prices.

Organizations like the Integrated Resource Recovery Centres (IRRCs) established by Waste Management Authority of Sri Lanka have tried to formalize and improve conditions for waste workers while maintaining their community knowledge and networks.

When you sell your recyclables to the local kalagedi vendor or scrap dealer, you're participating in this economy — and supporting livelihoods that depend on materials recovery. Choosing to recycle is not just an environmental act; it is also an economic one.`,
    keyMessage: 'Sri Lanka\'s kalagedi vendors and scrap dealers are the unsung heroes of recycling — supporting them is supporting the circular economy.',
    reflection:
      'Do you regularly sell recyclables to informal collectors? Do you know the person who collects from your area? How could you make it easier for them to collect from you?',
    facts: [
      'Informal waste pickers recover more recyclables globally than formal systems combined',
      'Sri Lanka\'s kalagedi vendor network has operated for over a century',
      'Integrated Resource Recovery Centres aim to formalize and support waste workers',
      'The informal recycling sector employs hundreds of thousands across South Asia',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'Compared to formal recycling systems, informal waste pickers recover:',
        options: ['About the same amount', 'Less recyclables', 'More recyclables', 'Only hazardous materials'],
        correctIndex: 2,
        explanation: 'Estimates suggest informal waste pickers and collectors recover more recyclable material globally than all formal recycling systems combined.',
      },
      {
        type: 'true-false',
        question: 'Supporting kalagedi vendors has no environmental benefit.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Sri Lanka\'s kalagedi vendors and scrap dealers are the unsung heroes of recycling — supporting them is supporting the circular economy and keeping materials out of landfills.',
      },
      {
        type: 'multiple-choice',
        question: 'What does "IRRC" stand for in Sri Lanka\'s waste management?',
        options: ['International Recycling Research Centre', 'Integrated Resource Recovery Centre', 'Industrial Rubber Recycling Company', 'Island-wide Refuse and Rubbish Collection'],
        correctIndex: 1,
        explanation: 'Integrated Resource Recovery Centres (IRRCs) aim to formalize and improve conditions for waste workers while maintaining their community knowledge and networks.',
      },
    ],
  },
  '24': {
    day: 24,
    title: 'Your Personal Impact',
    icon: '👤',
    story: `It can be hard to feel that individual actions matter in the face of systemic problems. But your daily choices, accumulated over a lifetime, add up to a significant footprint — and a significant opportunity for impact.

The average Sri Lankan generates approximately 0.5–1 kg of waste per day. Over a lifetime of 75 years, that's between 13 and 27 tonnes of waste. If half of that were diverted through recycling, composting, and reduction, the impact would be enormous — multiplied across every household, community, and generation.

Research consistently shows that personal environmental behavior also influences others. People who visibly recycle encourage neighbors to recycle. Parents who compost raise children who compost. Friends who carry reusable bags normalize reusable bags. Social norms are built from individual choices observed by others.

Your participation in EcoHabit is itself a statement. The points you've earned, the lessons you've completed, and the logs you've made represent real decisions — to sort rather than dump, to learn rather than ignore, to act rather than wait.

The cumulative environmental impact of EcoHabit's community — if everyone logged honestly and acted consistently — would be measurable: tonnes of CO₂ prevented, tonnes of plastic kept from landfills, tonnes of food waste composted.

You are not one person acting alone. You are part of a movement.`,
    keyMessage: 'Your individual choices, multiplied across a lifetime and a community, create measurable environmental change.',
    reflection:
      'Looking at your EcoHabit journey so far — what habit change are you most proud of? What has been harder than expected? What will you commit to for the next 30 days?',
    facts: [
      'The average Sri Lankan generates 0.5–1 kg of waste per day',
      'Over a lifetime, one person generates 13–27 tonnes of waste',
      'Visible recycling behavior increases recycling rates in neighbors by up to 12%',
      'Personal behavior change is the most infectious form of social change',
    ],
    points: 50,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'How much waste does the average Sri Lankan generate over a lifetime?',
        options: ['5–10 tonnes', '13–27 tonnes', '30–50 tonnes', 'Over 100 tonnes'],
        correctIndex: 1,
        explanation: 'The average Sri Lankan generates 0.5–1 kg of waste per day. Over a lifetime of 75 years, that\'s between 13 and 27 tonnes of waste.',
      },
      {
        type: 'true-false',
        question: 'Individual eco-actions have no influence on the behavior of people around you.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'Your individual choices, multiplied across a lifetime and a community, create measurable environmental change. Visible recycling behavior increases recycling rates in neighbors by up to 12%.',
      },
      {
        type: 'multiple-choice',
        question: 'By how much does visible recycling behavior increase recycling rates in neighbors?',
        options: ['2%', '5%', '12%', '25%'],
        correctIndex: 2,
        explanation: 'Research shows that visible recycling behavior increases recycling rates in neighbors by up to 12% — your actions inspire others around you.',
      },
    ],
  },
  '25': {
    day: 25,
    title: 'The Future is Now',
    icon: '🌍',
    story: `You've made it. Twenty-five days of learning, reflecting, and acting. You've traced the journey of plastic from factory to ocean. You've learned why glass can be recycled forever and why food waste releases methane. You've discovered the informal economy of kalagedi vendors, the policy levers of government, and the creative power of upcycling.

But this isn't the end — it's the beginning of a deeper awareness that stays with you for life.

The environmental challenges Sri Lanka faces — and the world faces — are real and urgent. Climate change, plastic pollution, food waste, and species loss are not distant abstractions. They show up in Colombo's flooded streets during monsoon, in the sea turtles on Rekawa beach, in the elephants dying from polythene at Ampara's open dumps.

But so does the hope. In every community volunteer who spends a Saturday picking up litter on a beach. In every school student who starts a compost bin. In every household that switches to a reusable bottle. In every kalagedi vendor who cycles through the neighborhood. In every engineer designing a smarter recycling system. In you, opening this app each day to log an action and learn something new.

The future of Sri Lanka's environment is not fixed. It is being written right now — in millions of small decisions, every day, by people like you.

Keep logging. Keep learning. Keep leading.

The future is now. And it needs you.`,
    keyMessage: 'Your 25-day journey has transformed awareness into habit — keep going, keep growing, keep leading.',
    reflection:
      'What is the single most important thing you have learned across these 25 days? How will you share it with someone in your life?',
    facts: [
      'You have completed all 25 EcoHabit lessons — fewer than 1% of users reach this milestone',
      'Consistent daily habits reduce carbon footprint more than occasional big gestures',
      'Sri Lanka\'s environmental future depends on citizens who are informed and engaged',
      'Sharing knowledge multiplies your impact — teach one person what you\'ve learned',
    ],
    points: 100,
    quiz: [
      {
        type: 'multiple-choice',
        question: 'What is the most effective way to reduce your carbon footprint?',
        options: ['One large annual eco-action', 'Consistent daily eco-habits', 'Moving to a different country', 'Buying eco-certified products only'],
        correctIndex: 1,
        explanation: 'Consistent daily habits reduce carbon footprint more than occasional big gestures — every day matters.',
      },
      {
        type: 'true-false',
        question: 'Completing 25 EcoHabit lessons is something only a small fraction of users achieve.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'Fewer than 1% of users reach this milestone — your 25-day journey has transformed awareness into habit. Keep going, keep growing, keep leading.',
      },
      {
        type: 'multiple-choice',
        question: 'What is the most powerful way to multiply your environmental impact?',
        options: ['Buy more eco-products', 'Share knowledge with others', 'Follow more eco accounts', 'Donate to charities'],
        correctIndex: 1,
        explanation: 'Sharing knowledge multiplies your impact — teaching one person what you\'ve learned creates a ripple effect that extends your eco-impact far beyond your own actions.',
      },
    ],
  },
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { addPoints } = useGamificationStore();
  const [slide, setSlide] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const day = params.day as string;
  const lesson = LESSONS_DATA[day];

  if (!lesson) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-gray-800">Lesson Not Found</h1>
        <button onClick={() => router.push('/lessons')} className="mt-4 text-green-600">
          Back to Lessons
        </button>
      </div>
    );
  }

  const isCompleted = user?.completedLessons?.includes(day) ?? false;

  // Slides: story(0), facts(1), reflection(2), quiz(3), complete(4)
  const slides = [
    { type: 'story', title: lesson.title },
    { type: 'facts', title: 'Key Facts' },
    { type: 'reflection', title: 'Reflection' },
    { type: 'quiz', title: 'Quiz' },
    { type: 'complete', title: 'Mark Complete' },
  ];

  const handleComplete = async () => {
    if (!user || completing || isCompleted) return;
    setCompleting(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        completedLessons: arrayUnion(day),
        totalPoints: (user.totalPoints ?? 0) + lesson.points,
        updatedAt: serverTimestamp(),
      });
      updateUser({
        completedLessons: [...(user.completedLessons ?? []), day],
        totalPoints: (user.totalPoints ?? 0) + lesson.points,
      });
      addPoints(lesson.points);
      // Track analytics
      trackLessonCompleted(lesson.day, quizScore).catch(() => {});
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setSlide(4); // advance to complete slide
  };

  if (completed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
          <p className="text-gray-500 mb-4">You earned</p>
          <div className="text-4xl font-bold text-green-600 mb-6">+{lesson.points} pts</div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/lessons')}
              className="flex-1 border border-green-600 text-green-600 py-3 rounded-xl font-medium"
            >
              More Lessons
            </button>
            <button
              onClick={() => router.push('/home')}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/lessons')} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <div>
          <p className="text-xs text-gray-400">Day {lesson.day}</p>
          <h1 className="font-bold text-gray-800">{lesson.title}</h1>
        </div>
        <span className="ml-auto text-2xl">{lesson.icon}</span>
      </div>

      {/* Progress dots (5 total) */}
      <div className="flex items-center gap-2 justify-center">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === slide ? 'w-6 bg-green-500' : i < slide ? 'w-2 bg-green-300' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-64">
        {slide === 0 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">{lesson.title}</h2>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {lesson.story}
            </div>
          </div>
        )}

        {slide === 1 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Key Facts</h2>
            <div className="space-y-3">
              {lesson.facts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <p className="text-sm text-gray-700">{fact}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm font-semibold text-yellow-700 mb-1">Key Message</p>
              <p className="text-sm text-yellow-600 italic">&quot;{lesson.keyMessage}&quot;</p>
            </div>
          </div>
        )}

        {slide === 2 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Reflection</h2>
            <div className="text-4xl mb-4 text-center">🤔</div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-700 leading-relaxed">{lesson.reflection}</p>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Take a moment to think about this before continuing
            </p>
          </div>
        )}

        {slide === 3 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">Knowledge Check</h2>
            <LessonQuiz questions={lesson.quiz} onComplete={handleQuizComplete} />
          </div>
        )}

        {slide === 4 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="font-bold text-gray-800 mb-2">Ready to complete?</h2>
            {quizScore > 0 && (
              <p className="text-sm text-green-600 mb-3">
                Quiz score: {quizScore}/{lesson.quiz.length} correct 🌟
              </p>
            )}
            <p className="text-gray-500 text-sm mb-6">
              Mark this lesson as complete to earn your points reward
            </p>
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Points reward</p>
              <p className="text-3xl font-bold text-green-600">+{lesson.points} pts</p>
            </div>
            <button
              onClick={handleComplete}
              disabled={completing || isCompleted}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {isCompleted
                ? 'Already Completed ✓'
                : completing
                ? 'Saving...'
                : 'Mark as Complete ✓'}
            </button>
          </div>
        )}
      </div>

      {/* Navigation — hide "Next" on quiz slide (quiz handles its own nav) */}
      <div className="flex gap-3">
        <button
          onClick={() => setSlide(Math.max(0, slide - 1))}
          disabled={slide === 0}
          className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium disabled:opacity-40"
        >
          ← Previous
        </button>
        {slide < slides.length - 1 && slide !== 3 && (
          <button
            onClick={() => setSlide(slide + 1)}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
