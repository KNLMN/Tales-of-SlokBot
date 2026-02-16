-- Fix existing characters that have 0 stats
-- This updates characters created before the stat fix

-- Warriors: Should have attack_power and armor
UPDATE public.characters
SET
  attack_power = GREATEST(attack_power, 20),
  spell_power = GREATEST(spell_power, 5),
  armor = GREATEST(armor, 10)
WHERE class_id = 'warrior' AND attack_power < 20;

-- Mages: Should have spell_power
UPDATE public.characters
SET
  attack_power = GREATEST(attack_power, 5),
  spell_power = GREATEST(spell_power, 20),
  armor = GREATEST(armor, 5)
WHERE class_id = 'mage' AND spell_power < 20;

-- Priests: Should have spell_power (they use holy magic!)
UPDATE public.characters
SET
  attack_power = GREATEST(attack_power, 5),
  spell_power = GREATEST(spell_power, 20),
  armor = GREATEST(armor, 5)
WHERE class_id = 'priest' AND (spell_power < 20 OR attack_power = 0);
