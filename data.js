// ═══ CONFIG ═══
const WGER_TOKEN='a4d2f79b0b88a0175d5652a5965fdf145e3bf207';
const JBKEY='$2a$10$OGQ4ctNutWXPvH9k0.KQcOFZypBGmPJyDy7AfrwXX0IEZE/fmc946';
const JBURL='https://api.jsonbin.io/v3/b';

// ═══ USER PROFILES (Targets via Mifflin-St Jeor BMR + TDEE + Bulking Surplus) ═══
const USERS={
  sadik:{name:'SADIK',emoji:'🔥',age:20,height:173,initWeight:56.65,targetWeight:65,
    // BMR=1543 → TDEE=2391 → Bulk+300=2700 | Protein 2.1g/kg | BMI 18.9→21.7
    calories:2700,protein:135,carbs:338,fat:75},
  anas:{name:'ANAS',emoji:'⚡',age:18,height:175,initWeight:52,targetWeight:70,
    // BMR=1519 → TDEE=2354 → Bulk+450=2800 | Still growing at 18, BMI 16.98→22.9
    calories:2800,protein:120,carbs:400,fat:80}
};

// ═══ STATE ═══
let activeUser='sadik';
let timerInterval=null,timerTotal=60,timerRemaining=60,timerRunning=false;
let notifTimeout;

// ═══ WORKOUT DAYS — Aesthetic + Athletic Hybrid Split ═══
// GOAL: V-taper physique · Chest fills clothes · Wide shoulders · LEAN (no fat)
//       + Stamina · Explosive power · Running ability · Strength for all activities
// MON=Chest Power | TUE=Back+Biceps | WED=Athletic Conditioning
// THU=Rest        | FRI=Legs+Core   | SAT=Shoulders+Arms | SUN=Full Rest
const DAYS=[

  // ── MON: CHEST POWER ──────────────────────────────────────────────────────
  // Upper chest = filling your shirt collar & looking handsome in fitted clothes
  {day:'MON',muscle:'Chest Power',emoji:'🏋️',color:'var(--accent)',type:'push',
   warmup:'5 min jumping jacks + 15 push-ups + 10 arm circles each direction',exercises:[
    {name:'Incline DB Press',sets:'4',reps:'8-10',rest:'90s',equipment:'Dumbbells',icon:'📐',
     muscles:['Upper Chest','Front Delts','Triceps'],wgerTerm:'incline dumbbell press chest',
     steps:['Prop your back on sofa or chair at 30-45° incline angle','Hold DBs at chest, elbows at 70° — not flared to 90°','Press up and slightly inward — squeeze upper chest HARD at top','Lower slowly over 3 seconds — full stretch at the bottom','Feel UPPER chest doing all the work every single rep'],
     tip:'Upper chest fills your shirt at the collar. This is why some guys look amazing in T-shirts. Non-negotiable — do this first every Monday.'},
    {name:'Barbell Floor Press',sets:'4',reps:'8-10',rest:'90s',equipment:'Barbell',icon:'🏋️',
     muscles:['Chest','Triceps'],wgerTerm:'floor press barbell',
     steps:['Lie flat on floor, grip bar slightly wider than shoulders','Lower bar slowly to chest — 3 full seconds down','Press up explosively, squeeze chest hard at very top','Keep elbows at 45°, NOT flared out to 90°','Breathe out on the push, breathe in on the way down'],
     tip:'Raw chest strength builder. Getting stronger here = your chest will visibly grow within weeks. Prioritize adding weight gradually.'},
    {name:'DB Chest Fly',sets:'3',reps:'12-15',rest:'60s',equipment:'Dumbbells',icon:'🦋',
     muscles:['Chest (outer width)','Chest (stretch)'],wgerTerm:'dumbbell fly chest',
     steps:['Lie on floor, DBs raised above chest, palms facing each other','Open arms wide with slight bend in elbows throughout','Lower until elbows touch floor — maximum chest stretch','Squeeze chest to bring DBs back together in an arc','SLOW on the way down — 3 full seconds minimum'],
     tip:'The stretch position builds chest WIDTH. Wide chest = chest that fills any shirt beautifully from collar to bottom.'},
    {name:'EZ Bar Skull Crusher',sets:'3',reps:'10-12',rest:'60s',equipment:'EZ Bar',icon:'💀',
     muscles:['Triceps Long Head'],wgerTerm:'lying triceps extension skull',
     steps:['Lie down, hold EZ bar directly above forehead with both hands','Upper arms stay completely vertical — locked in position always','Lower bar toward forehead slowly — 3 full seconds down','Extend arms back up — only forearms move, never upper arms','Breathe out on extension, breathe in on the way down'],
     tip:'Triceps = 2/3 of arm size. Big arms come from big triceps — not just biceps. This is the best tricep mass builder.'},
    {name:'Diamond Push-Up',sets:'3',reps:'Max reps',rest:'45s',equipment:'Bodyweight',icon:'💎',
     muscles:['Inner Chest','Triceps'],wgerTerm:'',
     steps:['Make a diamond/triangle with both hands placed directly under chest','Keep body in perfect straight line from head to heel — no sagging','Lower chest all the way to your hands — full range of motion','Press up explosively, squeeze inner chest hard at the top','If easy — elevate feet on sofa or chair to increase difficulty'],
     tip:'Best finisher — inner chest definition + tricep burn. Go to ABSOLUTE failure. Do NOT stop early. This is the chest detail exercise.'}
  ]},

  // ── TUE: BACK WIDTH + BICEPS ──────────────────────────────────────────────
  // Wide lats = the V-taper that makes your waist look small and shoulders huge
  {day:'TUE',muscle:'Back + Biceps',emoji:'🔙',color:'var(--blue)',type:'pull',
   warmup:'5 min light rows + 10 shoulder rolls + 15 face pulls or YTW raises',exercises:[
    {name:'Barbell Bent-Over Row',sets:'4',reps:'8-10',rest:'90s',equipment:'Barbell',icon:'🔃',
     muscles:['Lats','Mid-Back','Biceps'],wgerTerm:'bent over barbell row',
     steps:['Hinge at hips to 45°, soft bend in knees, flat back throughout','Grip barbell slightly wider than shoulder width','Pull bar to belly button — squeeze shoulder blades together HARD','Hold 1 full second at the top, then lower with total control','Keep back flat always — rounding even once = injury risk'],
     tip:'King of back exercises. Wide lats create the V-shape that makes shoulders look enormous. Priority #1 for the aesthetic physique you want.'},
    {name:'DB One-Arm Row',sets:'4',reps:'10-12 each',rest:'60s',equipment:'Dumbbells',icon:'💪',
     muscles:['Lats','Mid-Back','Rear Delts'],wgerTerm:'one arm row dumbbell single',
     steps:['Support one hand and same-side knee on bench or table','Let DB hang straight down from your shoulder — full stretch','Drive elbow back and UP as high as possible past your torso','Squeeze the lat HARD at the top — hold 1 full second','Lower slowly to full arm extension — feel the lat stretch at bottom'],
     tip:'Drive your elbow BEHIND your body — imagine tucking elbow into your back pocket. This fully activates the lat for maximum width.'},
    {name:'Rear Delt DB Fly',sets:'3',reps:'15-20',rest:'45s',equipment:'Dumbbells',icon:'🔄',
     muscles:['Rear Deltoids','Upper Back'],wgerTerm:'rear delt fly dumbbell bent over',
     steps:['Stand, hinge forward at 45°, DBs hanging below chest','Arms slightly bent — raise both out to the sides simultaneously','Squeeze shoulder blades together hard at the very top','Lower slowly — feel rear delts lengthening under full control','Use light weight — this is pure isolation, not a strength move'],
     tip:'Rear delts make shoulders look THICK and powerful from behind AND in clothes. Always include — most beginners skip this and regret it.'},
    {name:'EZ Bar Curl',sets:'4',reps:'10-12',rest:'60s',equipment:'EZ Bar',icon:'💪',
     muscles:['Biceps'],wgerTerm:'ez bar curl bicep',
     steps:['Stand, grip EZ bar on angled inner grips','Elbows pinned firmly to your sides — do NOT move them at all','Curl bar up slowly — squeeze absolutely hard at very top','Lower over 3 full seconds — never drop the bar down','Full range of motion absolutely every single rep'],
     tip:'No swinging. No body english. Strict form gives 10x better bicep response than heavy sloppy reps every single time.'},
    {name:'Hammer Curl',sets:'3',reps:'12 each',rest:'45s',equipment:'Dumbbells',icon:'🔨',
     muscles:['Biceps','Brachialis','Forearms'],wgerTerm:'hammer curl neutral grip',
     steps:['DBs at sides, neutral grip — thumbs pointing up always','Elbows stay pinned to your sides throughout the entire movement','Curl DB toward shoulder without rotating your wrist at all','Squeeze hard at the very top for 1 full second','Lower slowly over 3 seconds feeling every fiber working'],
     tip:'Builds arm THICKNESS — the brachialis under the bicep pushes it up, making arms look massive in T-shirt sleeves. Essential for the look you want.'}
  ]},

  // ── WED: ATHLETIC CONDITIONING ────────────────────────────────────────────
  // PURPOSE: Stamina · Explosive power · Cardio · Prevent fat gain
  // This separates a gym body from a truly ATHLETIC body that can run, jump, fight
  {day:'WED',muscle:'Stamina + Power',emoji:'⚡',color:'var(--gold)',type:'conditioning',
   warmup:'2 min non-stop high knees + 10 hip circles + 10 leg swings each leg',exercises:[
    {name:'Burpees',sets:'4',reps:'12',rest:'45s',equipment:'Bodyweight',icon:'💥',
     muscles:['Full Body','Cardio','Explosive Power'],wgerTerm:'',
     steps:['Stand, then squat and place both hands flat on the floor','Jump both feet back together into a push-up plank position','Do one full push-up for maximum chest work (optional but recommended)','Jump feet back to hands explosively','Jump straight UP with arms overhead — land softly with bent knees always'],
     tip:'Burpees are the most complete athletic exercise on Earth. 4×12 = 48 reps of total-body conditioning. This is literally what builds running stamina and all-round fitness.'},
    {name:'Jump Squat',sets:'4',reps:'15',rest:'45s',equipment:'Bodyweight',icon:'🦘',
     muscles:['Quads','Glutes','Calves','Explosive Power'],wgerTerm:'',
     steps:['Stand feet shoulder-width apart, toes slightly out','Squat to 90° — thighs parallel to the floor — proper depth','Explode upward as HARD as possible — maximum jump height','Land softly on both feet with slightly bent knees to absorb force','Immediately begin next rep — zero pause at the bottom position'],
     tip:'Builds fast-twitch explosive power in legs — the kind needed for sprinting, jumping, and fighting. Land SOFT always to protect knees and joints.'},
    {name:'Mountain Climbers',sets:'3',reps:'40 total',rest:'30s',equipment:'Bodyweight',icon:'🧗',
     muscles:['Core','Hip Flexors','Cardio'],wgerTerm:'',
     steps:['Start in push-up plank — hands under shoulders, body perfectly straight','Drive right knee explosively all the way toward chest','Immediately switch — left knee drives in as right foot goes back','Keep your HIPS DOWN — do not let them rise up at any point','Move feet as fast as physically possible — this is a cardio movement'],
     tip:'Best core + cardio combo in one single movement. Perfect for stamina AND visible abs. 40 reps = 20 per leg. Keep form throughout.'},
    {name:'Explosive Push-Up',sets:'3',reps:'10',rest:'45s',equipment:'Bodyweight',icon:'💥',
     muscles:['Chest','Triceps','Explosive Power'],wgerTerm:'',
     steps:['Standard push-up position — hands shoulder-width apart','Lower chest fully to the floor — maximum stretch at bottom','Explode UP as hard as physically possible — hands should leave floor','Catch yourself softly and immediately lower for the next rep','Make every single rep a MAXIMUM effort explosive — no half-measures'],
     tip:'Trains fast-twitch muscle fibers in chest and triceps — the power needed for sport, fighting, throwing, and all athletic activity.'},
    {name:'High Knees Sprint',sets:'4',reps:'30 seconds max',rest:'30s',equipment:'Bodyweight',icon:'🏃',
     muscles:['Cardio','Hip Flexors','Calves','Running Stamina'],wgerTerm:'',
     steps:['Stand with feet hip-width apart — get mentally ready first','Drive your knees up to waist height, alternating as fast as possible','Pump arms powerfully and rhythmically — opposite arm to opposite knee','Stay on the balls of your feet — NEVER flat-footed throughout','Maximum speed for the full 30 seconds — do NOT slow down or stop'],
     tip:'Directly improves your running speed and cardio fitness. 30 seconds at maximum = equivalent to a genuine sprint interval. Your lungs will burn.'},
    {name:'Plank to Push-Up',sets:'3',reps:'10 each side',rest:'30s',equipment:'Bodyweight',icon:'🔄',
     muscles:['Core','Chest','Shoulders','Stability'],wgerTerm:'',
     steps:['Start in forearm plank on elbows — body perfectly straight line','Push up to one hand, then the other — reaching full push-up position','Hold top position for 1 second: squeeze core and glutes absolutely hard','Lower back down to one forearm, then the other — fully controlled','Alternate which hand leads each rep — equal reps on both sides'],
     tip:'Trains core stability AND chest endurance simultaneously — essential athletic carry-over to every sport and physical activity you do.'}
  ]},

  // ── THU: REST + STRETCH ───────────────────────────────────────────────────
  {day:'THU',muscle:'REST + Stretch',emoji:'😴',color:'var(--green)',type:'rest',
   warmup:'10-minute gentle full body stretch',exercises:[
    {name:'Full Body Stretch Routine',sets:'1',reps:'15 min',rest:'-',equipment:'None',icon:'🧘',
     muscles:['Recovery'],wgerTerm:'',
     steps:['Chest doorway stretch — 30 seconds each side of chest','Hip flexor lunge stretch — 30 seconds each leg','Shoulder cross-body stretch — 30 seconds each arm','Seated hamstring fold forward — hold 30 seconds','Cat-cow spinal mobility — 10-15 slow breathing-matched reps'],
     tip:'Rest days are when muscles ACTUALLY GROW. Sleep 8 hours, hit your calories, let the body rebuild stronger. This day is as important as training days.'},
    {name:'20 Min Easy Walk',sets:'1',reps:'20-30 min',rest:'-',equipment:'None',icon:'🚶',
     muscles:['Blood Flow','Active Recovery'],wgerTerm:'',
     steps:['Easy comfortable walking pace — absolutely not jogging today','Go outside for fresh air and natural sunlight if possible','Listen to Quran, nasheeds, or a podcast you enjoy','Stay relaxed — this is pure recovery, not training at all','Hydrate well — minimum 500ml water throughout the walk'],
     tip:'Walking improves blood flow and nutrient delivery directly to recovering muscles — this literally speeds up muscle growth between sessions.'}
  ]},

  // ── FRI: LEGS + CORE ──────────────────────────────────────────────────────
  // Athletic leg power + visible abs = complete aesthetic + performance package
  {day:'FRI',muscle:'Legs + Core',emoji:'🦵',color:'var(--red)',type:'legs',
   warmup:'5 min jumping jacks + 15 bodyweight squats + 10 leg swings each leg',exercises:[
    {name:'Goblet Squat',sets:'4',reps:'10-12',rest:'90s',equipment:'Dumbbells or Barbell',icon:'🏋️',
     muscles:['Quads','Glutes','Hamstrings','Core'],wgerTerm:'goblet squat front',
     steps:['Hold DB or barbell at chest level with both hands firmly','Feet shoulder-width apart, toes slightly outward for comfort','Squat until thighs are PARALLEL to floor — no half squats allowed','Drive through your HEELS explosively to stand back up to full height','Squeeze glutes absolutely hard at the very top of every single rep'],
     tip:'Squat releases more testosterone and growth hormone than any other exercise. Athletic legs = faster running, higher jumps, and all physical power comes from here.'},
    {name:'DB Romanian Deadlift',sets:'4',reps:'10-12',rest:'90s',equipment:'Dumbbells',icon:'🔽',
     muscles:['Hamstrings','Glutes','Lower Back'],wgerTerm:'romanian deadlift dumbbell hamstring',
     steps:['Hold DBs in front of thighs, stand tall, slight knee bend — locked','Push hips BACK — the hips always lead this movement, not the back','Lower DBs down your legs feeling the full hamstring stretch at bottom','Drive hips FORWARD explosively to return to fully upright position','Keep back flat always — if it rounds at all, reduce weight immediately'],
     tip:'Builds the hamstring and glute fullness that makes the body look athletic and powerful from BEHIND. This is the exercise for the "good from every angle" physique.'},
    {name:'DB Walking Lunge',sets:'3',reps:'12 each leg',rest:'60s',equipment:'Dumbbells',icon:'🚶',
     muscles:['Quads','Glutes','Balance','Stability'],wgerTerm:'walking lunge dumbbell leg',
     steps:['Hold DBs at sides, stand tall with perfectly upright posture','Step forward and lower the BACK knee down toward the floor','Keep front foot completely flat on floor — push through that heel','Alternate legs as you walk forward across the room','Keep upper body perfectly upright — do not lean forward at all'],
     tip:'Builds quad and glute definition AND improves balance and coordination for every single athletic movement you will ever perform.'},
    {name:'Standing Calf Raise',sets:'3',reps:'20-25',rest:'30s',equipment:'Dumbbells',icon:'🦵',
     muscles:['Calves','Ankle Strength'],wgerTerm:'calf raise standing heel',
     steps:['Stand on step edge or flat floor, hold DBs at sides for resistance','Rise up on toes as HIGH as physically possible — maximum range','HOLD at the very top for 3 full seconds — do not skip this hold','Lower slowly below starting level if standing on a step','Feel the full contraction AND the full stretch on every single rep'],
     tip:'3-second pause at top = dramatic calf development over time. Athletic calves directly improve your running speed and jumping height.'},
    {name:'Ab Circuit',sets:'3',reps:'15 each move',rest:'30s',equipment:'None',icon:'📐',
     muscles:['Abs','Core','Obliques'],wgerTerm:'plank core stability forearm',
     steps:['Move 1 — Crunches: chin to chest, squeeze abs upward, 15 reps','Move 2 — Leg Raises: flat on floor, raise straight legs to 90°, lower slow, 15 reps','Move 3 — Bicycle Crunch: elbow to opposite knee, 15 reps each side','Zero rest between the 3 moves — flow through all of them continuously','Rest only 30 seconds between complete circuits — then go again'],
     tip:'All 3 planes of the core in one circuit. Flat stomach + V-lines come from this consistency done every single Friday over months. Never skip.'}
  ]},

  // ── SAT: SHOULDERS + ARMS ─────────────────────────────────────────────────
  // Wide shoulders = #1 visual cue that a body looks handsome and athletic in clothes
  {day:'SAT',muscle:'Shoulders + Arms',emoji:'💪',color:'var(--purple)',type:'push',
   warmup:'5 min light cardio + 20 arm circles + 10 shoulder shrugs + 10 neck rolls',exercises:[
    {name:'Seated DB Overhead Press',sets:'4',reps:'10-12',rest:'90s',equipment:'Dumbbells',icon:'⬆️',
     muscles:['Front Delts','Side Delts','Triceps'],wgerTerm:'shoulder press dumbbell seated overhead',
     steps:['Sit upright on a chair — back straight and well supported','DBs at ear height — elbows at 70° angle, NOT 90° flared out','Press overhead until arms are fully extended at the top','Lower slowly over 3 full seconds — do NOT let gravity do this for you','Keep core braced throughout — do not arch lower back at all'],
     tip:'Shoulders are the #1 muscle for looking powerful and athletic in any clothing. Wide shoulders = the perfect V-shape silhouette from absolutely every angle.'},
    {name:'DB Lateral Raise',sets:'4',reps:'15-20',rest:'45s',equipment:'Dumbbells',icon:'🦅',
     muscles:['Side Deltoids'],wgerTerm:'lateral raise side delt',
     steps:['Stand with slight forward lean at hips and slight bend in elbows','Raise both arms out to the sides simultaneously in one smooth arc','Stop EXACTLY at shoulder height — never higher than that point','Lead with your PINKIES, not your thumbs — activates side delt far better','Lower slowly over 3 full seconds — never let them just drop down'],
     tip:'This single exercise builds the WIDE shoulder look that changes your entire body silhouette. Light weight with perfect form always beats heavy and sloppy here.'},
    {name:'DB Front Raise',sets:'3',reps:'12-15',rest:'45s',equipment:'Dumbbells',icon:'⬆️',
     muscles:['Front Deltoids'],wgerTerm:'front raise dumbbell anterior delt',
     steps:['Stand, DBs held in front of thighs, palms facing down toward floor','Raise both arms forward together smoothly to eye level','Slight bend in elbows throughout — not rigid straight arms','Do not swing at all — strictly controlled movement throughout','Lower slowly over 3 seconds feeling front delt engage the whole way'],
     tip:'Front delts make shoulders look full and round from every possible angle — key for the complete balanced athletic aesthetic you are building toward.'},
    {name:'DB Overhead Tricep Extension',sets:'3',reps:'12-15',rest:'45s',equipment:'Dumbbells',icon:'⬆️',
     muscles:['Triceps Long Head'],wgerTerm:'overhead triceps extension dumbbell behind head',
     steps:['Hold one dumbbell with both hands clasped directly above your head','Lower it behind your head by bending only at the elbows — control it','Keep elbows pointing at the ceiling throughout — never let them flare','Extend arms back up to fully locked out — squeeze triceps hard at top','Keep core tight throughout to protect your lower spine completely'],
     tip:'The long head is the biggest visible portion of the tricep — what makes arms look massive from behind. This is the most critical tricep exercise for the aesthetic look.'},
    {name:'DB Concentration Curl',sets:'3',reps:'12 each',rest:'45s',equipment:'Dumbbells',icon:'🎯',
     muscles:['Biceps Peak'],wgerTerm:'concentration curl seated preacher',
     steps:['Sit on chair edge — brace your elbow firmly against inside of thigh','Curl DB upward slowly with total and complete focus on the bicep only','Squeeze absolutely HARD at the very top — hold for 2 full seconds','Lower over 3 full seconds feeling every single muscle fiber working','Zero swinging, zero body movement whatsoever — pure isolation only'],
     tip:'Best exercise for bicep PEAK — the high ball you see when someone flexes. This is your show muscle. Slow and focused beats heavy and sloppy absolutely every time.'}
  ]},

  // ── SUN: FULL REST ────────────────────────────────────────────────────────
  {day:'SUN',muscle:'FULL REST',emoji:'🕌',color:'var(--blue)',type:'rest',
   warmup:'No workout today — full recovery',exercises:[
    {name:'Full Rest + Spiritual Recovery',sets:'-',reps:'-',rest:'-',equipment:'None',icon:'🤲',
     muscles:['Full Recovery'],wgerTerm:'',
     steps:['Complete rest from all training — let muscles fully repair and grow','Hit your FULL calorie and protein target today — eating IS training','Pray all 5 prayers — mental and spiritual health directly fuels physical performance','Spend quality time with family — mental recovery is as real as physical recovery','Plan next week: which exercises to add weight to, what to improve, set intentions'],
     tip:'Muscles grow during REST, not during training. Allah built the concept of rest into creation. Honor this day — it is as important as any training session.'}
  ]}
];

// ═══ SADIK MEALS (2700 kcal) — Age 20, 173cm, 56.65kg → 65kg ═══
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

// ═══ ANAS MEALS (2800 kcal) — Age 18, 175cm, 52kg, BMI 16.98 → Target 70kg ═══
// Mifflin-St Jeor: BMR=1519, TDEE≈2354, Surplus+450=2800 kcal
// At 18, still growing — needs extra carbs and fats above and beyond muscle building
const ANAS_MEALS=[
  {time:'FAJR TIME',name:'🌅 Pre-Fajr / Sehri',kcal:520,items:[
    {name:'Oats',amount:'80g',protein:'11g',carbs:'54g',fat:'7g',kcal:330},
    {name:'Full-Fat Milk',amount:'200ml',protein:'6g',carbs:'10g',fat:'7g',kcal:124},
    {name:'Banana',amount:'1 large',protein:'1g',carbs:'27g',fat:'0g',kcal:105},
    {name:'Peanut Butter',amount:'10g',protein:'3g',carbs:'1g',fat:'5g',kcal:60}]},
  {time:'BREAKFAST',name:'🍳 Breakfast (8–9 AM)',kcal:560,items:[
    {name:'Boiled / Scrambled Eggs',amount:'4 eggs',protein:'24g',carbs:'2g',fat:'20g',kcal:280},
    {name:'Whole Wheat Roti',amount:'3 rotis',protein:'9g',carbs:'48g',fat:'3g',kcal:255},
    {name:'Peanuts',amount:'10g',protein:'3g',carbs:'1g',fat:'5g',kcal:58}]},
  {time:'MID-MORNING',name:'🥛 Mid-Morning Snack (11 AM)',kcal:300,items:[
    {name:'Full-Fat Milk',amount:'300ml',protein:'10g',carbs:'15g',fat:'10g',kcal:186},
    {name:'Banana',amount:'1 medium',protein:'1g',carbs:'23g',fat:'0g',kcal:89},
    {name:'Dates (Khajoor)',amount:'3 pieces',protein:'0g',carbs:'18g',fat:'0g',kcal:72}]},
  {time:'LUNCH',name:'🍛 Lunch (1–2 PM)',kcal:680,items:[
    {name:'Halal Chicken (grilled)',amount:'150g',protein:'39g',carbs:'0g',fat:'5g',kcal:198},
    {name:'Rice (cooked)',amount:'200g',protein:'4g',carbs:'46g',fat:'0g',kcal:200},
    {name:'Dal (Masoor / Chana)',amount:'120g',protein:'9g',carbs:'19g',fat:'1g',kcal:124},
    {name:'Sabzi + 2 Rotis',amount:'2 rotis + sabzi',protein:'5g',carbs:'33g',fat:'2g',kcal:170}]},
  {time:'PRE-WORKOUT',name:'⚡ Pre-Workout (4–5 PM)',kcal:270,items:[
    {name:'Soya Chunks (soaked)',amount:'50g dry',protein:'26g',carbs:'17g',fat:'0.5g',kcal:175},
    {name:'Banana',amount:'1 medium',protein:'1g',carbs:'23g',fat:'0g',kcal:89}]},
  {time:'POST-WORKOUT',name:'🔥 Post-Workout / Dinner (7–8 PM)',kcal:680,items:[
    {name:'Eggs (whole)',amount:'3 eggs',protein:'18g',carbs:'1.5g',fat:'15g',kcal:210},
    {name:'Soya Chunks (cooked)',amount:'60g dry',protein:'31g',carbs:'20g',fat:'0.6g',kcal:210},
    {name:'Rice + Roti',amount:'2 rotis + medium rice',protein:'9g',carbs:'65g',fat:'3g',kcal:324}]},
  {time:'NIGHT',name:'🌙 Before Sleep (10 PM)',kcal:300,items:[
    {name:'Full-Fat Milk',amount:'400ml',protein:'13g',carbs:'20g',fat:'14g',kcal:250},
    {name:'Peanut Butter',amount:'15g',protein:'4g',carbs:'3g',fat:'8g',kcal:96}]}
];

// ═══ TIPS ═══
const TIPS=[
  {icon:'🕌',cls:'gold',title:'Islamic Fitness Mindset',text:'The Prophet ﷺ said: "A strong believer is better and more beloved to Allah than a weak believer." Exercise is an amanah — your body has rights over you. Train with intention.'},
  {icon:'🥚',cls:'orange',title:'Eggs Are Your Free Protein',text:'4 eggs = 24g protein for ~₹20. The most complete natural protein source. Eat them EVERY morning without fail. Cheap, halal, and perfect for building muscle.'},
  {icon:'🫘',cls:'green',title:'Soya Chunks = Secret Weapon',text:'52g protein per 100g dry weight. Cheaper than any supplement. Soak overnight, cook with masala. This is your muscle-building secret weapon — use it daily.'},
  {icon:'😴',cls:'blue',title:'Sleep Is Your Anabolic Window',text:'Growth Hormone is released during deep sleep. You CANNOT build muscle without 7-8 hours. Sleep early after Isha. No phone after 10pm. No exceptions.'},
  {icon:'💧',cls:'blue',title:'Drink 3 Litres of Water Daily',text:'Muscles are 75% water. Dehydration drops strength by 15-20%. Always hydrate between sets and throughout the day. Carry a water bottle everywhere.'},
  {icon:'📈',cls:'orange',title:'Progressive Overload = Growth',text:'Add 1-2 reps or a little weight every week. Muscle ONLY grows when challenged beyond last time. Track your lifts in notes — never be complacent or comfortable.'},
  {icon:'🍗',cls:'green',title:'Halal Protein Sources (No Supplements)',text:'Eggs, halal chicken, milk, soya chunks, dal, peanuts — combined these give 130g+ protein daily for under ₹100/day. SubhanAllah — Allah provided everything you need.'},
  {icon:'🏋️',cls:'orange',title:'V-Taper Chest Secret',text:'Mind-muscle connection is EVERYTHING. Squeeze at the top of every press. Go slow on the way down — 3 full seconds. Upper chest (incline) fills your shirt collar. Do this every Monday.'},
  {icon:'⏰',cls:'gold',title:'Best Workout Time for You Both',text:'After Asr prayer (4-5 PM) is perfect — body temperature is highest, coordination peaks, testosterone is elevated. Evening workouts consistently produce better results.'},
  {icon:'📏',cls:'orange',title:'Measure Monthly, Not Daily',text:'Weight fluctuates 1-2kg daily (water, food, time of day). Measure same day each week, same time (morning, after toilet). Trust the long process — results come in months.'},
  {icon:'🧬',cls:'blue',title:'Ages 18-20: Your Golden Anabolic Window',text:'Testosterone peaks between 18-25 years old. This is literally the BEST time in your life to build muscle. Consistency now = a physique for life. Do NOT waste this window — train hard, eat big, sleep 8 hours. The body Allah gave you at this age is a gift.'},
  {icon:'📐',cls:'green',title:'Anas: BMI Alert — You Need More Food',text:'Anas is at BMI 16.98 — clinically underweight. Primary goal = EAT MORE, not just train harder. 2800 kcal every single day non-negotiable. Miss a meal = miss muscle. Treat eating as training.'},
  {icon:'🦴',cls:'gold',title:'Teen Bones Still Growing',text:'At 18, your bones are still strengthening. Compound lifts (rows, squats, presses) stimulate bone density alongside muscle. Full range of motion always — partial reps = partial development.'},
  {icon:'⚡',cls:'orange',title:'Wednesday Conditioning = Your Secret',text:'The Athletic Conditioning day (Wednesday) keeps you lean, builds cardio, and adds explosive power. This is what separates "gym guys" from truly athletic bodies. Never skip it — this is your stamina day.'}
];
