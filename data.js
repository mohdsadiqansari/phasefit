// ═══ CONFIG ═══
const WGER_TOKEN='a4d2f79b0b88a0175d5652a5965fdf145e3bf207';
const JBKEY='$2a$10$OGQ4ctNutWXPvH9k0.KQcOFZypBGmPJyDy7AfrwXX0IEZE/fmc946';
const JBURL='https://api.jsonbin.io/v3/b';

// ═══ USER PROFILES ═══
const USERS={
  sadik:{name:'SADIK',emoji:'🔥',height:173,initWeight:56.65,targetWeight:65,calories:2700,protein:135,carbs:338,fat:75},
  anas:{name:'ANAS',emoji:'⚡',height:175,initWeight:52,targetWeight:70,calories:2300,protein:110,carbs:290,fat:65}
};

// ═══ STATE ═══
let activeUser='sadik';
let timerInterval=null,timerTotal=60,timerRemaining=60,timerRunning=false;
let notifTimeout;

// ═══ WORKOUT DAYS (shared for both users) ═══
const DAYS=[
  {day:'MON',muscle:'Chest + Triceps',emoji:'🏋️',color:'var(--accent)',type:'push',
   warmup:'5 min jumping jacks + 10 arm circles',exercises:[
    {name:'Barbell Floor Press',sets:'4',reps:'8-10',rest:'90s',equipment:'Barbell',icon:'🏋️',
     muscles:['Chest','Triceps'],wgerTerm:'bench press',
     steps:['Lie flat on floor, grip bar slightly wider than shoulders','Lower bar slowly to chest — 3 full seconds down','Press up explosively, squeeze chest hard at top','Keep elbows at 45°, NOT flared out to 90°','Breathe out on the push, in on the way down'],
     tip:'Floor press limits shoulder strain. Squeeze chest HARD at the top — connections beats weight.'},
    {name:'Dumbbell Chest Flyes',sets:'3',reps:'12-15',rest:'60s',equipment:'Dumbbells',icon:'🦋',
     muscles:['Chest (stretch)'],wgerTerm:'dumbbell flyes',
     steps:['Lie on floor, DBs above chest, palms facing each other','Open arms wide with a slight bend in elbows','Lower until elbows touch the floor for full stretch','Squeeze chest to bring DBs back up in an arc','SLOW on the way down — 3 seconds minimum'],
     tip:'The stretch builds chest width. Control the negative for best results.'},
    {name:'Close-Grip DB Press',sets:'3',reps:'10-12',rest:'60s',equipment:'Dumbbells',icon:'💪',
     muscles:['Inner Chest','Triceps'],wgerTerm:'close grip bench press',
     steps:['Hold DBs close together, touching on chest','Press upward squeezing DBs inward the whole time','Imagine squeezing an orange between your palms','Extend fully, hold 1 second at top','Lower slowly and under control'],
     tip:'Hits inner chest AND triceps — double benefit in one move.'},
    {name:'EZ Bar Skull Crushers',sets:'3',reps:'10-12',rest:'60s',equipment:'EZ Bar',icon:'💀',
     muscles:['Triceps Long Head'],wgerTerm:'skull crusher',
     steps:['Lie down, hold EZ bar above forehead with both hands','Upper arms stay completely vertical — locked in place','Lower bar toward forehead slowly over 3 seconds','Extend arms back up — only forearms move','Breathe out on the extension'],
     tip:'Upper arms should NOT move. If they do, reduce weight.'},
    {name:'Tricep Kickbacks',sets:'3',reps:'12-15',rest:'45s',equipment:'Dumbbells',icon:'🔁',
     muscles:['Triceps'],wgerTerm:'triceps kickback',
     steps:['Lean forward 45°, support on table or your knee','Upper arm parallel to floor and LOCKED there','Extend forearm straight back to full lockout','Squeeze hard at full extension for 1 second','Lower slowly over 2 seconds'],
     tip:'Full lockout + 1-second squeeze = maximum burn every rep.'}
  ]},
  {day:'TUE',muscle:'Back + Biceps',emoji:'🔙',color:'var(--blue)',type:'pull',
   warmup:'5 min light rows + 10 shoulder rolls',exercises:[
    {name:'Barbell Bent-Over Row',sets:'4',reps:'8-10',rest:'90s',equipment:'Barbell',icon:'🔃',
     muscles:['Lats','Mid-Back','Biceps'],wgerTerm:'bent over row',
     steps:['Hinge at hips to 45°, soft bend in knees','Grip barbell slightly wider than shoulder width','Pull bar to your belly button — squeeze shoulder blades','Hold 1 second at top, then lower controlled','Keep your back flat — no rounding'],
     tip:'Pull with your ELBOWS, not your hands. This is the single best back builder.'},
    {name:'Dumbbell One-Arm Row',sets:'3',reps:'10-12 each',rest:'60s',equipment:'Dumbbells',icon:'💪',
     muscles:['Lats','Mid-Back'],wgerTerm:'one arm dumbbell row',
     steps:['Support hand and knee on bench or table','Let DB hang straight down from shoulder','Pull elbow back and UP past your torso','Squeeze lat hard at the top','Lower slowly to full stretch at bottom'],
     tip:'Drive your elbow BEHIND your body, not just upward.'},
    {name:'EZ Bar Curl',sets:'4',reps:'10-12',rest:'60s',equipment:'EZ Bar',icon:'💪',
     muscles:['Biceps Peak'],wgerTerm:'barbell curl',
     steps:['Stand, grip EZ bar on angled inner grips','Elbows pinned firm to your sides — do NOT move them','Curl bar up slowly, squeeze hard at top','Lower over 3 full seconds — this builds too','Full range of motion every single rep'],
     tip:'No swinging. Strict form gives 10x better bicep response.'},
    {name:'Dumbbell Hammer Curl',sets:'3',reps:'12 each',rest:'45s',equipment:'Dumbbells',icon:'🔨',
     muscles:['Biceps','Brachialis','Forearms'],wgerTerm:'hammer curl',
     steps:['DBs at sides, neutral grip — thumbs pointing up','Elbows stay pinned to your sides','Curl DB toward shoulder without rotating your wrist','Squeeze at top for 1 full second','Alternate arms or do both together'],
     tip:'Builds arm THICKNESS and killer forearms. Never skip this.'},
    {name:'DB Reverse Curl',sets:'3',reps:'12-15',rest:'45s',equipment:'Dumbbells',icon:'🔄',
     muscles:['Forearms','Brachioradialis'],wgerTerm:'reverse curl',
     steps:['Grip DBs with OVERHAND grip — knuckles facing up','Elbows pinned to your sides throughout','Curl upward, keep wrists straight and firm','Lower with control over 3 seconds','Feel the forearm burn — that means it is working'],
     tip:'Slow negatives = massive forearm gains over time.'}
  ]},
  {day:'WED',muscle:'Shoulders + Forearms',emoji:'🪩',color:'var(--gold)',type:'shoulders',
   warmup:'5 min rotator cuff warmup + arm circles each direction',exercises:[
    {name:'Seated DB Overhead Press',sets:'4',reps:'10-12',rest:'90s',equipment:'Dumbbells',icon:'⬆️',
     muscles:['Front Delts','Side Delts'],wgerTerm:'seated dumbbell shoulder press',
     steps:['Sit upright, back straight with support','DBs at ear height, elbows at 70°— not 90° out','Press overhead until arms nearly straight','Lower slowly — do NOT let gravity do the work','Keep core tight throughout the entire set'],
     tip:'70° elbow angle protects your shoulder joint from impingement.'},
    {name:'DB Lateral Raise',sets:'4',reps:'15-20',rest:'45s',equipment:'Dumbbells',icon:'🦅',
     muscles:['Side Deltoids'],wgerTerm:'lateral raise',
     steps:['Slight forward lean at hips, slight bend in elbows','Raise both arms out to the side simultaneously','Stop exactly at shoulder height — not above','Lead with your PINKIES, not your thumbs','Lower slowly over 3 seconds — feel it'],
     tip:'Use LIGHT weight with perfect form. This builds the wide shoulder look.'},
    {name:'DB Front Raise',sets:'3',reps:'12-15',rest:'45s',equipment:'Dumbbells',icon:'⬆️',
     muscles:['Front Deltoids'],wgerTerm:'front raise',
     steps:['Stand, DBs in front of thighs, palms down','Raise one or both arms forward to eye level','Slight bend in elbows throughout','Do not swing — strict and controlled','Lower slowly feeling front delt working'],
     tip:'Alternate arms for better focus and balance.'},
    {name:'Barbell Upright Row',sets:'3',reps:'10-12',rest:'60s',equipment:'Barbell',icon:'📡',
     muscles:['Side Delts','Traps'],wgerTerm:'upright row',
     steps:['Hold barbell with WIDE overhand grip — wider than shoulders','Pull bar straight up close along your body','Elbows drive HIGH and wide — above your wrists','Raise to chin level and no higher','Lower slowly with full control'],
     tip:'Wide grip = safer for your shoulders. Never pull above chin level.'},
    {name:'Wrist Curls + Extensions',sets:'3',reps:'20-25',rest:'30s',equipment:'Dumbbells',icon:'✊',
     muscles:['Forearm Flexors','Forearm Extensors'],wgerTerm:'wrist curl',
     steps:['Rest forearm on thigh with wrist over the edge','Curl wrist upward slowly — full range of motion','Then flip hand over for extension, knuckles up','Complete full range in both directions','High reps, slow tempo — squeeze at the top'],
     tip:'Train BOTH flexion and extension for balanced forearm development.'},
    {name:"Farmer's Hold",sets:'3',reps:'45-60 sec',rest:'45s',equipment:'Dumbbells',icon:'🧱',
     muscles:['Grip Strength','Forearms','Core'],wgerTerm:'farmers walk',
     steps:['Pick up heaviest available DBs in both hands','Stand tall — shoulders back and down','Hold at sides completely still','Do not let them swing or sway','Put down ONLY when grip fully fails'],
     tip:'Builds insane forearm size AND grip strength simultaneously.'}
  ]},
  {day:'THU',muscle:'REST + Stretch',emoji:'😴',color:'var(--green)',type:'rest',
   warmup:'10-minute full body stretch',exercises:[
    {name:'Full Body Stretch Routine',sets:'1',reps:'10 min',rest:'-',equipment:'None',icon:'🧘',
     muscles:['Recovery'],wgerTerm:'',
     steps:['Chest doorway stretch — 30 seconds each side','Hip flexor lunge stretch — 30 seconds each leg','Shoulder cross-body stretch — 30 seconds each arm','Seated hamstring fold — 30 seconds','Cat-cow spinal mobility — 10-15 slow reps'],
     tip:'Rest days are when muscles GROW. Never skip — recovery is non-negotiable.'},
    {name:'Light Walk',sets:'1',reps:'20-30 min',rest:'-',equipment:'None',icon:'🚶',
     muscles:['Blood Flow','Active Recovery'],wgerTerm:'',
     steps:['Easy comfortable pace — not a jog','Go outside for fresh air if possible','Listen to Quran or nasheeds','Stay aerobic — you should be able to talk','Hydrate well throughout the walk'],
     tip:'Walking improves blood flow and nutrient delivery to your recovering muscles.'}
  ]},
  {day:'FRI',muscle:'Legs',emoji:'🦵',color:'var(--red)',type:'legs',
   warmup:'5 min jumping jacks + 10 bodyweight squats',exercises:[
    {name:'Goblet Squat',sets:'4',reps:'10-12',rest:'90s',equipment:'DB or Barbell',icon:'🏋️',
     muscles:['Quads','Glutes','Hamstrings'],wgerTerm:'squat',
     steps:['Hold DB or barbell at chest level with both hands','Feet shoulder-width apart, toes slightly outward','Squat down until thighs are parallel to the floor','Drive through your HEELS to stand back up','Keep chest up, back flat throughout'],
     tip:'Goblet style is perfect without a rack — safe and effective.'},
    {name:'DB Reverse Lunge',sets:'3',reps:'10 each leg',rest:'60s',equipment:'Dumbbells',icon:'🚶',
     muscles:['Quads','Glutes'],wgerTerm:'lunge',
     steps:['Stand holding DBs at your sides','Step BACK with one foot — not forward','Lower the back knee toward the floor','Front foot stays flat — push through that heel','Return to standing and repeat other leg'],
     tip:'Reverse lunges are easier on knees than forward lunges. Great choice.'},
    {name:'DB Romanian Deadlift',sets:'4',reps:'10-12',rest:'90s',equipment:'Dumbbells',icon:'🔽',
     muscles:['Hamstrings','Glutes'],wgerTerm:'romanian deadlift',
     steps:['Hold DBs in front of thighs, standing tall','Soft bend in knees — they stay in that position','Push hips BACK and lower DBs down your legs','Feel the hamstring stretch at the bottom','Drive hips forward explosively to return'],
     tip:'GO SLOW on the way down — 3-4 seconds. That is where gains happen.'},
    {name:'DB Calf Raise',sets:'3',reps:'20-25',rest:'30s',equipment:'Dumbbells',icon:'🦵',
     muscles:['Calves'],wgerTerm:'calf raise',
     steps:['Stand on edge of a step or on flat floor','Hold DBs at your sides for added resistance','Rise up on your toes as high as possible','HOLD at the top for 3 full seconds','Lower slowly below the step level if possible'],
     tip:'3-second pause at the top dramatically improves calf development.'}
  ]},
  {day:'SAT',muscle:'Arms + Abs',emoji:'💪',color:'var(--accent)',type:'arms',
   warmup:'5 min light cardio + arm circles both directions',exercises:[
    {name:'Barbell Curl',sets:'4',reps:'8-10',rest:'60s',equipment:'Barbell',icon:'💪',
     muscles:['Biceps (full)'],wgerTerm:'barbell curl',
     steps:['Stand, straight bar with shoulder-width underhand grip','Elbows PINNED to your sides — they do not move','Curl the bar up to shoulder height slowly','Squeeze bicep hard at the top for 1 second','Lower over 3 slow seconds — do not drop it'],
     tip:'Elbows to ribs. They should not move an inch. That is the rule.'},
    {name:'DB Concentration Curl',sets:'3',reps:'12 each',rest:'45s',equipment:'Dumbbells',icon:'🎯',
     muscles:['Biceps Peak'],wgerTerm:'concentration curl',
     steps:['Sit on edge of chair or bench','Brace your elbow against the inside of your thigh','Curl DB up slowly with complete focus','Hard squeeze at the top — hold 2 seconds','Lower over 3 full seconds feeling every fiber'],
     tip:'Best exercise for bicep PEAK shape. Slow and focused wins here.'},
    {name:'EZ Bar Close-Grip Press',sets:'3',reps:'10-12',rest:'60s',equipment:'EZ Bar',icon:'🏋️',
     muscles:['Triceps','Chest'],wgerTerm:'close grip bench press',
     steps:['Lie on floor, close grip on EZ bar inner handles','Elbows tucked CLOSE to your body throughout','Press up to full arm extension and lockout','Lower slowly back toward chest over 3 seconds','Feel the triceps doing the work'],
     tip:'Triceps are 2/3 of your arm size. Prioritize them!'},
    {name:'DB Overhead Tricep Extension',sets:'3',reps:'12-15',rest:'45s',equipment:'Dumbbells',icon:'⬆️',
     muscles:['Triceps Long Head'],wgerTerm:'triceps extension overhead',
     steps:['Hold one DB with both hands directly overhead','Lower the DB behind your head by bending elbows','Elbows stay pointed at the ceiling throughout','Extend arms back up — squeeze triceps hard','Keep core tight to protect your lower spine'],
     tip:'The long head is the BIGGEST part of triceps. This is its best exercise.'},
    {name:'Plank Hold',sets:'3',reps:'30-45 sec',rest:'30s',equipment:'None',icon:'📐',
     muscles:['Core','Abs','Glutes'],wgerTerm:'plank',
     steps:['Forearms on floor, elbows directly under shoulders','Toes on ground, form one straight line head to heel','Squeeze ABS, GLUTES, and QUADS simultaneously','Keep hips perfectly level — no sagging or tenting','Breathe steadily and controlled throughout'],
     tip:'Perfect plank = full body tension. Do NOT just survive — actively contract.'}
  ]},
  {day:'SUN',muscle:'FULL REST',emoji:'🕌',color:'var(--blue)',type:'rest',
   warmup:'No workout today — full recovery',exercises:[
    {name:'Full Rest + Jummah Prep',sets:'-',reps:'-',rest:'-',equipment:'None',icon:'🤲',
     muscles:['Full Recovery'],wgerTerm:'',
     steps:['Complete rest from training — let muscles repair','Hit your full calorie and protein target today','Pray and make dua for health and strength','Spend time with family — mental recovery matters too','Plan and visualize next week\'s workouts mentally'],
     tip:'Muscle grows during REST. This day is as important as any training day.'}
  ]}
];

// ═══ SADIK MEALS (2700 kcal) ═══
const SADIK_MEALS=[
  {time:'FAJR TIME',name:'🌅 Pre-Fajr / Sehri',kcal:480,items:[
    {name:'Oats',amount:'80g',protein:'11g',carbs:'56g',fat:'7g',kcal:330},
    {name:'Milk (full-fat)',amount:'200ml',protein:'6g',carbs:'10g',fat:'7g',kcal:124},
    {name:'Banana',amount:'1 medium',protein:'1g',carbs:'23g',fat:'0g',kcal:89}]},
  {time:'BREAKFAST',name:'🍳 Breakfast (8–9 AM)',kcal:620,items:[
    {name:'Boiled / Scrambled Eggs',amount:'4 eggs',protein:'24g',carbs:'2g',fat:'20g',kcal:280},
    {name:'Whole Wheat Roti',amount:'3 rotis',protein:'9g',carbs:'48g',fat:'3g',kcal:255},
    {name:'Peanuts',amount:'30g',protein:'8g',carbs:'4g',fat:'14g',kcal:174}]},
  {time:'MID-MORNING',name:'🥛 Mid-Morning Snack (11 AM)',kcal:380,items:[
    {name:'Full-Fat Milk',amount:'400ml',protein:'13g',carbs:'20g',fat:'14g',kcal:250},
    {name:'Banana',amount:'2 medium',protein:'2g',carbs:'46g',fat:'0g',kcal:178}]},
  {time:'LUNCH',name:'🍛 Lunch (1–2 PM)',kcal:720,items:[
    {name:'Halal Chicken (grilled)',amount:'150g',protein:'39g',carbs:'0g',fat:'5g',kcal:198},
    {name:'Rice (cooked)',amount:'200g',protein:'4g',carbs:'46g',fat:'0g',kcal:200},
    {name:'Dal (Masoor / Chana)',amount:'150g',protein:'10g',carbs:'20g',fat:'1g',kcal:130},
    {name:'Sabzi + 2 Rotis',amount:'2 rotis + sabzi',protein:'5g',carbs:'30g',fat:'2g',kcal:160}]},
  {time:'PRE-WORKOUT',name:'⚡ Pre-Workout (4–5 PM)',kcal:250,items:[
    {name:'Soya Chunks (soaked)',amount:'50g dry',protein:'26g',carbs:'17g',fat:'0.5g',kcal:175},
    {name:'Banana',amount:'1 medium',protein:'1g',carbs:'23g',fat:'0g',kcal:89}]},
  {time:'POST-WORKOUT',name:'🔥 Post-Workout / Dinner (7–8 PM)',kcal:780,items:[
    {name:'Eggs (whole)',amount:'3 eggs',protein:'18g',carbs:'1.5g',fat:'15g',kcal:210},
    {name:'Soya Chunks (cooked)',amount:'80g dry',protein:'41g',carbs:'28g',fat:'0.8g',kcal:280},
    {name:'Rice + Roti',amount:'2 rotis + small rice',protein:'8g',carbs:'55g',fat:'2g',kcal:270}]},
  {time:'NIGHT',name:'🌙 Before Sleep (10 PM)',kcal:310,items:[
    {name:'Full-Fat Milk',amount:'400ml',protein:'13g',carbs:'20g',fat:'14g',kcal:250},
    {name:'Peanut Butter',amount:'15g',protein:'4g',carbs:'3g',fat:'8g',kcal:96}]}
];

// ═══ ANAS MEALS (2300 kcal) ═══
const ANAS_MEALS=[
  {time:'FAJR TIME',name:'🌅 Pre-Fajr / Sehri',kcal:363,items:[
    {name:'Oats',amount:'50g',protein:'7g',carbs:'34g',fat:'5g',kcal:212},
    {name:'Milk (full-fat)',amount:'100ml',protein:'3g',carbs:'5g',fat:'3g',kcal:62},
    {name:'Banana',amount:'1 medium',protein:'1g',carbs:'23g',fat:'0g',kcal:89}]},
  {time:'BREAKFAST',name:'🍳 Breakfast (8–9 AM)',kcal:455,items:[
    {name:'Boiled / Scrambled Eggs',amount:'3 eggs',protein:'18g',carbs:'1.5g',fat:'15g',kcal:210},
    {name:'Whole Wheat Roti',amount:'2 rotis',protein:'6g',carbs:'32g',fat:'2g',kcal:170},
    {name:'Peanuts',amount:'15g',protein:'4g',carbs:'2g',fat:'7g',kcal:86}]},
  {time:'MID-MORNING',name:'🥛 Mid-Morning Snack (11 AM)',kcal:213,items:[
    {name:'Full-Fat Milk',amount:'200ml',protein:'6g',carbs:'10g',fat:'7g',kcal:124},
    {name:'Banana',amount:'1 medium',protein:'1g',carbs:'23g',fat:'0g',kcal:89}]},
  {time:'LUNCH',name:'🍛 Lunch (1–2 PM)',kcal:490,items:[
    {name:'Halal Chicken (grilled)',amount:'100g',protein:'26g',carbs:'0g',fat:'3g',kcal:131},
    {name:'Rice (cooked)',amount:'150g',protein:'3g',carbs:'35g',fat:'0g',kcal:150},
    {name:'Dal (Masoor / Chana)',amount:'100g',protein:'8g',carbs:'16g',fat:'1g',kcal:104},
    {name:'Sabzi + 1 Roti',amount:'1 roti + sabzi',protein:'4g',carbs:'20g',fat:'1g',kcal:105}]},
  {time:'PRE-WORKOUT',name:'⚡ Pre-Workout (4–5 PM)',kcal:214,items:[
    {name:'Soya Chunks (soaked)',amount:'35g dry',protein:'18g',carbs:'12g',fat:'0.5g',kcal:125},
    {name:'Banana',amount:'1 medium',protein:'1g',carbs:'23g',fat:'0g',kcal:89}]},
  {time:'POST-WORKOUT',name:'🔥 Post-Workout / Dinner (7–8 PM)',kcal:497,items:[
    {name:'Eggs (whole)',amount:'2 eggs',protein:'12g',carbs:'1g',fat:'10g',kcal:140},
    {name:'Soya Chunks (cooked)',amount:'50g dry',protein:'26g',carbs:'17g',fat:'0.5g',kcal:175},
    {name:'Rice + Roti',amount:'1.5 rotis + small rice',protein:'5g',carbs:'36g',fat:'1.5g',kcal:182}]},
  {time:'NIGHT',name:'🌙 Before Sleep (10 PM)',kcal:170,items:[
    {name:'Full-Fat Milk',amount:'250ml',protein:'8g',carbs:'13g',fat:'9g',kcal:155},
    {name:'Khajoor (Dates)',amount:'2 pieces',protein:'0g',carbs:'18g',fat:'0g',kcal:67}]}
];

// ═══ TIPS ═══
const TIPS=[
  {icon:'🕌',cls:'gold',title:'Islamic Fitness Mindset',text:'The Prophet ﷺ said: "A strong believer is better and more beloved to Allah than a weak believer." Exercise is an amanah — your body has rights over you.'},
  {icon:'🥚',cls:'orange',title:'Eggs Are Your Free Protein',text:'4 eggs = 24g protein for ~₹20. The most complete natural protein source. Eat them EVERY morning without fail. Cheap, halal, and perfect.'},
  {icon:'🫘',cls:'green',title:'Soya Chunks = Secret Weapon',text:'52g protein per 100g dry weight. Cheaper than any supplement. Soak overnight, cook with masala. This is your muscle-building secret.'},
  {icon:'😴',cls:'blue',title:'Sleep Is Your Anabolic Window',text:'Growth Hormone is released during deep sleep. You CANNOT build muscle without 7-8 hours. Sleep early after Isha. No exceptions.'},
  {icon:'💧',cls:'blue',title:'Drink 3 Litres of Water Daily',text:'Muscles are 75% water. Dehydration drops strength by 15-20%. Always hydrate between sets and throughout the day.'},
  {icon:'📈',cls:'orange',title:'Progressive Overload = Growth',text:'Add 1-2 reps or a little weight every week. Muscle ONLY grows when challenged beyond last time. Track your lifts — never be complacent.'},
  {icon:'🍗',cls:'green',title:'Halal Protein Sources (No Supplements)',text:'Eggs, halal chicken, milk, soya chunks, dal, peanuts — combined, these give 130g+ protein daily for under ₹100/day. SubhanAllah.'},
  {icon:'🏋️',cls:'orange',title:'Chest Growth Secret',text:'Mind-muscle connection is EVERYTHING. Squeeze at the top of every press. Go slow on the way down — 3 full seconds. Your chest will respond.'},
  {icon:'⏰',cls:'gold',title:'Best Workout Time for You Both',text:'After Asr prayer (4-5 PM) is perfect — body temperature is highest, coordination peaks, and testosterone is elevated. Evening workouts win.'},
  {icon:'📏',cls:'orange',title:'Measure Monthly, Not Daily',text:'Weight fluctuates 1-2kg daily (water, food). Measure on the same day each week, same time (morning, after toilet). Trust the long process.'}
];
