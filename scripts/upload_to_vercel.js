const fs = require('fs');

async function main() {
  const files = [
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_01.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_02.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_03.json',
    '/home/sayantan-axcess/Documents/Quiz_PROJ/question_set/cloudprep_extended_mixed_4x200/cloudprep_extended_mixed_set_04.json'
  ];

  for (const file of files) {
    console.log(`\nReading ${file}...`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    console.log(`Uploading ${data.questions?.length || 0} questions to Vercel...`);
    
    // Map data
    const mappedQuestions = (data.questions || []).map(q => {
      // Map domain correctly
      let domain = "Cloud Concepts";
      if (q.domain) {
        domain = q.domain;
      } else if (q.domain_id) {
        switch(q.domain_id) {
          case 1: domain = "Cloud Concepts"; break;
          case 2: domain = "Security and Compliance"; break;
          case 3: domain = "Cloud Technology and Services"; break;
          case 4: domain = "Billing, Pricing and Support"; break;
        }
      }

      // Map options
      let correctCount = 0;
      const mappedOptions = q.options.map((opt, idx) => {
        if (opt.isCorrect || opt.is_correct) correctCount++;
        return {
          label: opt.id || opt.label || String.fromCharCode(65 + idx),
          text: opt.text,
          isCorrect: opt.isCorrect === true || opt.is_correct === true,
          explanation: opt.explanation || null
        };
      });

      return {
        questionCode: q.id || q.questionCode,
        questionText: q.question || q.questionText,
        type: (q.type || 'single_select').toUpperCase(),
        requiredSelections: q.requiredSelections || correctCount || 1,
        domain: domain,
        domainId: q.domain_id || 1,
        topic: q.topic || 'General',
        difficulty: q.difficulty || (q.is_scenario_based ? 'HARD' : 'MEDIUM'),
        explanation: q.explanation || 'No explanation provided.',
        options: mappedOptions
      };
    });

    const CHUNK_SIZE = 10;
    for (let i = 0; i < mappedQuestions.length; i += CHUNK_SIZE) {
      const chunk = mappedQuestions.slice(i, i + CHUNK_SIZE);
      console.log(`  Uploading chunk ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk.length} questions)...`);
      
      const res = await fetch('https://quiz-ccp-seven.vercel.app/api/admin/questions/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chunk)
      });

      const result = await res.json();
      if (result.success) {
        console.log(`  ✅ Success: ${result.message}`);
      } else {
        console.error(`  ❌ Failed: ${result.error}`);
      }
    }
  }

  console.log('\nAll files processed.');
}

main().catch(console.error);
