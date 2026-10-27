insert into public.emission_factors
  (category, activity, unit, kg_co2e_per_unit, source, source_year)
values
  -- Energy (Hub Tables 1 and 6)
  ('Energy', 'Natural gas',                 'scf',    0.05444, 'EPA GHG Emission Factors Hub (Table 1)', 2025),
  ('Energy', 'Propane',                     'gallon', 5.72,    'EPA GHG Emission Factors Hub (Table 1)', 2025),
  ('Energy', 'Motor gasoline',              'gallon', 8.78,    'EPA GHG Emission Factors Hub (Table 1)', 2025),
  ('Energy', 'Distillate fuel oil No. 2',   'gallon', 10.21,   'EPA GHG Emission Factors Hub (Table 1)', 2025),
  ('Energy', 'Kerosene',                    'gallon', 10.15,   'EPA GHG Emission Factors Hub (Table 1)', 2025),
  ('Energy', 'Electricity (US average grid)', 'kWh',  0.3499,  'EPA GHG Emission Factors Hub (Table 6)', 2025),

  -- Waste (Hub Table 9, derived from WARM v16; converted to kg CO2e per lb)
  ('Waste', 'Mixed MSW - landfilled',       'lb', 0.29,  'EPA GHG Emission Factors Hub (Table 9 / WARM v16)', 2025),
  ('Waste', 'Food waste - composted',       'lb', 0.055, 'EPA GHG Emission Factors Hub (Table 9 / WARM v16)', 2025),
  ('Waste', 'Aluminum cans - recycled',     'lb', 0.03,  'EPA GHG Emission Factors Hub (Table 9 / WARM v16)', 2025),
  ('Waste', 'Aluminum cans - landfilled',   'lb', 0.01,  'EPA GHG Emission Factors Hub (Table 9 / WARM v16)', 2025),
  ('Waste', 'Mixed plastics - combusted',   'lb', 1.17,  'EPA GHG Emission Factors Hub (Table 9 / WARM v16)', 2025)
on conflict (category, activity, source) do nothing;