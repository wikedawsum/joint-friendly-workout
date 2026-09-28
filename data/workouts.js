window.WORKOUT_WEEKS = {
  1: {
    title: "Week 1 — Baseline & Comfort",
    days: [
      {
        id:"day1", label:"Day 1", title:"Lower Body + Core", duration:"30–40 min",
        focus:["Lower body","Core","Treadmill"], summary:"Gentle leg and hip strength with a short walk.",
        warmup:[
          warm("walk","Easy Treadmill Walk","4–5 min","0% incline. Comfortable pace; this is just to get warm."),
          warm("shoulder","Shoulder Rolls","8 each way","Slow, relaxed circles forward and backward."),
          warm("balance","Supported Weight Shifts","8 / side","Hold support and gently shift weight side to side. Keep both feet down."),
          warm("march","Gentle Supported March","30–45 sec","Low knee height. Hold support; make the movement tiny if needed."),
          warm("sit-stand","Sit-to-Stand Practice","3–5 reps","Easy practice reps only. These do not count toward your working sets.")
        ],
        exercises:[
          ex("sit-stand","Sit-to-Stand","2 × 8","Use a firm, relatively high chair. Lean forward slightly, stand tall, then sit back down slowly.","Use a comfortable chair height and stop if symptoms radiate farther down the leg.","Raise the seat with a firm cushion and use chair arms or a counter. Shorten the range if the knee or hip hurts."),
          ex("side-leg","Supported Side Leg Raise","2 × 10 / side","Hold a counter or chair. Keep your trunk tall and move one leg gently to the side without leaning.","Keep the movement small and avoid side-bending through the low back.","Keep the standing knee soft. Move only as far as the hip tolerates."),
          ex("ham-curl","Standing Hamstring Curl","2 × 10 / side","Hold support and slowly bend one knee, bringing the heel back only as far as comfortable.","Stay upright and avoid arching your back.","Use a small, pain-free knee bend. Stop if the knee pinches or catches."),
          ex("wall-push","Wall Push-Up","2 × 10","Hands on the wall at chest height. Lower your chest toward the wall, then press away.","Keep your ribs stacked and avoid letting the low back sag.","Stand close enough to the wall that the position feels stable and comfortable."),
          ex("row","Supported Row","2 × 10 / side","Person A may use a light dumbbell. Support one hand on a counter and pull the other elbow back. Person B can use no weight or a water bottle.","Keep the torso only slightly hinged and choose a position that does not increase leg symptoms.","Use a tall stance and support yourself well. A water bottle is optional."),
          ex("calf","Standing Calf Raise","2 × 12","Hold support, rise onto the balls of your feet, pause, then lower slowly.","Keep your torso stacked and avoid leaning forward.","Hold support and use a smaller range if the knee or hip feels unstable."),
          ex("brace","Standing Core Brace","5 × 5 sec","Gently tighten your abdomen as if preparing for a light poke. Keep breathing normally.","Use only a mild brace—do not force your spine into a position that increases symptoms.","Do this standing with support or seated if standing is uncomfortable.")
        ],
        finisherTitle:"Cool-Down Walk", finisher:"5–10 minutes easy treadmill walking at 0% incline. Break it into shorter bouts if needed."
      },
      {
        id:"day2", label:"Day 2", title:"Upper Body + Walking", duration:"30–40 min",
        focus:["Upper body","Posture","Treadmill"], summary:"Low-impact upper-body work plus comfortable cardio.",
        warmup:[
          warm("walk","Easy Treadmill Walk","4–5 min","0% incline at a comfortable pace."),
          warm("shoulder","Shoulder Rolls","8 each way","Relax the neck and make slow circles."),
          warm("brace","Gentle Posture Reset","5 breaths","Stand or sit tall, relax the shoulders, and breathe normally."),
          warm("wall-push","Wall Push-Up Practice","3–5 reps","Easy practice reps only; stop well before fatigue.")
        ],
        exercises:[
          ex("wall-push","Wall Push-Up","2 × 10","Hands on the wall at chest height. Lower your chest toward the wall, then press away.","Keep your ribs stacked and avoid letting the low back sag.","Stand close enough to the wall that the position feels stable and comfortable."),
          ex("row","Supported Row","2 × 10 / side","Person A may use a light dumbbell. Support one hand on a counter and pull the other elbow back. Person B can use no weight or a water bottle.","Keep the torso only slightly hinged and choose a position that does not increase leg symptoms.","Use a tall stance and support yourself well. A water bottle is optional."),
          ex("curl","Biceps Curl","2 × 10","Person A may use light dumbbells. Person B can use water bottles or no weight. Move slowly.","Stay tall and avoid leaning backward.","Perform seated if standing bothers the knee or hip."),
          ex("press","Wall Scapular Press","2 × 10","Place forearms on the wall. Gently press away so your shoulder blades glide apart, then relax them back.","Keep the movement in the shoulder blades rather than the low back.","Use a comfortable stance and keep weight evenly distributed."),
          ex("march","Supported March","2 × 8 / side","Hold a counter and lift one foot a few inches, alternating sides.","Keep lifts low. Stop if marching increases radiating symptoms.","Keep the lift very small and use strong hand support. Substitute seated marching if needed.")
        ],
        finisherTitle:"Walking Finisher", finisher:"10–15 minutes treadmill walking at an easy conversational pace, 0% incline."
      },
      {
        id:"day3", label:"Day 3", title:"Glutes + Mobility", duration:"25–35 min",
        focus:["Glutes","Mobility","Recovery"], summary:"Hip-supporting strength with a lighter training day.",
        warmup:[
          warm("walk","Easy Treadmill Walk","4–5 min","0% incline. Keep this deliberately easy."),
          warm("ankle","Ankle Pumps","10","Point and flex the feet gently while seated or standing with support."),
          warm("balance","Supported Weight Shifts","6 / side","Small side-to-side shifts to loosen up without deep bending."),
          warm("breathing","Easy Breathing","3 slow breaths","Relax your shoulders and avoid forcing any stretch.")
        ],
        exercises:[
          ex("glute","Glute Bridge or Standing Glute Squeeze","2 × 8–10","Bridge option: lie on your back with knees bent, squeeze the glutes and lift the hips a comfortable amount. Standing option: squeeze the glutes for 2–3 seconds.","Use the standing version if bridging increases sciatic symptoms.","Use the standing version if getting to the floor is difficult or the knee/hip dislikes the bridge position."),
          ex("side-leg","Supported Side Leg Raise","2 × 10 / side","Hold support and move the leg out to the side with a tall torso.","Keep range small and avoid low-back side bending.","Keep the standing knee soft; reduce the range if the hip is irritated."),
          ex("heel-slide","Heel Slide Core Control","2 × 6 / side","Lie on your back with knees bent. Gently brace, slide one heel away, then return it. Alternate sides.","Make the slide shorter if symptoms increase. Substitute a standing brace if lying down is uncomfortable.","Use a short slide. Substitute seated abdominal bracing if the hip or knee position is uncomfortable."),
          ex("ankle","Ankle Pumps","2 × 15","Seated or lying down, slowly point and flex the feet through a comfortable range.","Use this as gentle movement; no aggressive stretching.","Great as a low-load circulation and mobility drill. Keep it pain-free."),
          ex("breathing","90-Second Recovery Breathing","1 round","Sit or lie comfortably. Breathe slowly and let your shoulders relax.","Choose the position that feels best for your back and leg.","Choose a position that lets the hip and knee relax without strain.")
        ],
        finisherTitle:"Optional Recovery Walk", finisher:"Optional 5–10 minute easy treadmill walk if both joints and nerve symptoms feel calm."
      },
      {
        id:"day4", label:"Day 4", title:"Full Body Strength", duration:"30–40 min",
        focus:["Full body","Strength","Treadmill"], summary:"Repeat safe patterns and build confidence with controlled reps.",
        warmup:[
          warm("walk","Easy Treadmill Walk","4–5 min","0% incline at an easy pace."),
          warm("shoulder","Shoulder Rolls","8 each way","Slow circles with a relaxed neck."),
          warm("balance","Supported Weight Shifts","8 / side","Gently shift side to side while holding support."),
          warm("sit-stand","Sit-to-Stand Practice","3–5 reps","Use a high chair. These are easy practice reps, not working sets.")
        ],
        exercises:[
          ex("sit-stand","Sit-to-Stand","2 × 8","Stand from a firm chair and lower slowly. Use hands if needed.","Keep the range comfortable and stop if symptoms spread farther down the leg.","Use a higher seat and arm support. Depth is optional; pain-free control is the goal."),
          ex("wall-push","Wall Push-Up","2 × 10","Press smoothly away from the wall, keeping the body in one comfortable line.","Avoid excessive low-back arching.","Use a stance that feels stable for the knee and hip."),
          ex("row","Supported Row","2 × 10 / side","Person A may use a light dumbbell. Person B can use no weight or a water bottle.","Support yourself and keep the hinge shallow.","Stay tall and well supported; seated row motion is fine if needed."),
          ex("calf","Standing Calf Raise","2 × 12","Rise, pause, and lower slowly while holding support.","Keep your trunk tall.","Use strong hand support and a comfortable range."),
          ex("brace","Core Brace","5 × 5 sec","Gently tighten the abdomen while breathing normally.","No forced spinal flattening or aggressive bracing.","Perform seated if standing is tiring or uncomfortable.")
        ],
        finisherTitle:"Cool-Down Walk", finisher:"5–10 minutes easy treadmill walking at 0% incline."
      },
      {
        id:"day5", label:"Day 5", title:"Walking + Gentle Conditioning", duration:"25–40 min",
        focus:["Cardio","Balance","Easy conditioning"], summary:"Finish the week with low-impact movement and no need to chase intensity.",
        warmup:[
          warm("walk","Very Easy Treadmill Walk","5 min","0% incline. Start slower than your main walking pace."),
          warm("shoulder","Shoulder Rolls","8 each way","Keep the neck and jaw relaxed."),
          warm("ankle","Ankle Pumps","10","Gentle point-and-flex movement before the longer walk."),
          warm("balance","Supported Weight Shifts","6 / side","Small, comfortable shifts with both feet staying on the floor.")
        ],
        exercises:[
          ex("walk","Treadmill Walk","15–25 min total","Walk at a pace where you can still speak in full sentences. Break into 5–10 minute bouts if needed.","Shorten the walk or take breaks if leg symptoms intensify or travel farther down the leg.","Keep speed modest and incline at 0%. Stop if knee pain or swelling climbs during the session."),
          ex("balance","Supported Weight Shift","2 × 8 / side","Hold a counter and gently shift more weight onto one foot, then back to center. Keep both feet on the floor.","Stay upright and use a very small shift.","Do not force weight onto the painful side. Use both hands for support and keep the range tiny."),
          ex("calf","Standing Calf Raise","2 × 10","Hold support and perform slow, comfortable calf raises.","Keep posture tall.","Use a small range and strong hand support."),
          ex("shoulder","Shoulder Rolls","10 each direction","Slowly roll the shoulders forward and backward.","Keep the rest of your body relaxed.","Can be done seated if preferred.")
        ],
        finisherTitle:"Cool-Down", finisher:"2 minutes of comfortable seated or standing breathing. Week 1 should leave you feeling like you could have done more—not wiped out."
      }
    ]
  }
};
function ex(icon,name,dose,instructions,modA,modB){ return {icon,name,dose,instructions,modA,modB}; }
function warm(icon,name,dose,instructions){ return {icon,name,dose,instructions}; }
