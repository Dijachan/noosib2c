const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://begqvaikxdixitxbsfiu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZ3F2YWlreGRpeGl0eGJzZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDIwNDMsImV4cCI6MjA5MTkxODA0M30.2FwgA4kt8-mNeMVj3PYncj91lbhmvXxWcu-40bbv3_o';
const supabase = createClient(supabaseUrl, supabaseKey);

const DEMO_PATIENT_ID = '11111111-1111-1111-1111-111111111111';
const DEMO_DEVICE_ID = '77777777-7777-7777-7777-777777777777';

async function seedMeds() {
  console.log('--- SEEDING MEDICATIONS ---');

  const medications = [
    { name: 'Metformin', dosage: '500mg', type: 'Tablet', slot: 1, time: '08:00:00' },
    { name: 'Lisinopril', dosage: '10mg', type: 'Tablet', slot: 2, time: '13:00:00' },
    { name: 'Vitamin D', dosage: '2000IU', type: 'Capsule', slot: 7, time: '20:00:00' }
  ];

  for (const m of medications) {
    // 1. Upsert Medication
    const { data: med, error: medError } = await supabase
      .from('medications')
      .upsert({
        name: m.name,
        dosage: m.dosage,
        type: m.type,
        patient_id: DEMO_PATIENT_ID
      })
      .select()
      .single();

    if (medError) {
      console.error(`Error seeding ${m.name}:`, medError);
      continue;
    }

    // 2. Map to Slot
    const { error: slotError } = await supabase
      .from('medication_slots')
      .upsert({
        device_id: DEMO_DEVICE_ID,
        slot_number: m.slot,
        medication_id: med.id,
        scheduled_time: m.time,
        is_active: true
      });

    if (slotError) {
      console.error(`Error mapping slot for ${m.name}:`, slotError);
    } else {
      console.log(`Successfully seeded ${m.name} into Slot ${m.slot}`);
    }
  }

  console.log('--- SEEDING COMPLETE ---');
}

seedMeds();
