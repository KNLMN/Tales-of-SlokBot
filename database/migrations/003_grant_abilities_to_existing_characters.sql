-- Grant level 1 abilities to existing characters that don't have them yet

-- For each character, grant their class's level 1 abilities
INSERT INTO public.character_abilities (character_id, ability_id)
SELECT
    c.id as character_id,
    a.id as ability_id
FROM public.characters c
CROSS JOIN public.abilities a
WHERE a.class_id = c.class_id
  AND a.level_required = 1
  AND NOT EXISTS (
    SELECT 1
    FROM public.character_abilities ca
    WHERE ca.character_id = c.id
    AND ca.ability_id = a.id
  );

-- Verify: Show how many abilities each character now has
SELECT
    c.name as character_name,
    c.class_id,
    COUNT(ca.id) as ability_count
FROM public.characters c
LEFT JOIN public.character_abilities ca ON ca.character_id = c.id
GROUP BY c.id, c.name, c.class_id
ORDER BY c.name;
