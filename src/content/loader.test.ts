import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSheetContent, type SheetCsvBundle } from './loader';

const SAMPLE_BUNDLE: SheetCsvBundle = {
  categories: [
    'id,order,status,name_th,name_en,intro_th,intro_en',
    'noble-eightfold-path,2,Published,มรรคมีองค์ 8,The Noble Eightfold Path,ทางสายกลาง,The Middle Way',
    'five-precepts,1,published,ศีล 5,The Five Precepts,"ข้อปฏิบัติพื้นฐาน, เพื่อความสงบ\nของตนเองและสังคม",The basic moral practice.',
    'draft-cat,3,draft,หมวดร่าง,Draft Category,ร่าง,Draft',
  ].join('\n'),
  groups: [
    'category_id,id,order,tone,header_th,header_en,label_th,label_en',
    'noble-eightfold-path,conduct,2,sage,ศีล,Ethical Conduct (Sīla),ศีล,Ethical Conduct',
    'noble-eightfold-path,wisdom,1,saffron,ปัญญา,Wisdom (Paññā),ปัญญา,Wisdom',
    'unknown-cat,orphan,1,stone,ไม่ทราบ,,ไม่ทราบ,',
  ].join('\n'),
  items: [
    'category_id,number,group_id,status,pali_th,pali_en,meaning_th,meaning_en,explanation_th,explanation_en,example_th,example_en',
    'five-precepts,2,,published,อทินนาทานา เวรมณี,,เว้นจากการลักทรัพย์,,เคารพในทรัพย์สิน,,ไม่หยิบของเพื่อนโดยไม่ขอ,',
    'five-precepts,1,,published,ปาณาติปาตา เวรมณี,Pāṇātipātā veramaṇī,"เว้นจากการฆ่าสัตว์, และเบียดเบียนชีวิต\nทั้งทางกายและใจ",Abstaining from killing,เคารพในชีวิตของผู้อื่น,Respect for the lives of others.,ช่วยพาแมลงออกจากห้องแทนการตี,Gently carrying an insect outside.',
    'five-precepts,3,,draft,กาเมสุมิจฉาจารา เวรมณี,Kāmesu micchācārā veramaṇī,เว้นจากกาม,Abstaining from misconduct,ร่าง,Draft,,',
    'noble-eightfold-path,1,wisdom,published,สัมมาทิฏฐิ,Sammā-diṭṭhi,ความเห็นชอบ,Right View,เข้าใจตามจริง,Seeing things as they are.,,',
    'noble-eightfold-path,2,nonexistent-group,published,สัมมาสังกัปปะ,Sammā-saṅkappa,ความดำริชอบ,Right Intention,คิดดี,Goodwill,,',
    'draft-cat,1,,published,ข้อธรรมในหมวดร่าง,Draft item,ร่าง,Draft,ร่าง,Draft,,',
    'missing-category,1,,published,ข้อธรรมหลงหมวด,Orphan item,หลงหมวด,Orphan,หลงหมวด,Orphan,,',
  ].join('\n'),
  sources: [
    'category_id,order,text_th,text_en',
    'five-precepts,2,พจนานุกรมพุทธศาสน์,Dictionary of Buddhism',
    'five-precepts,1,พระไตรปิฎก (ฉบับหลวง),Thai Royal Edition Tipiṭaka',
    'missing-category,1,แหล่งอ้างอิงหลงหมวด,Orphan source',
  ].join('\n'),
  cardClips: [
    'clip_no,date,status,category,title_th,title_en',
    '10,2026-11-20,published,ศีล 5,เมตตาในชีวิตประจำวัน,Kindness in Daily Life',
    '2,2026-11-18,published,สติ,หายใจเข้าออกอย่างรู้ตัว,',
    '3,2026-11-19,draft,สติ,คลิปร่าง,Draft Clip',
  ].join('\n'),
};

test('loader parses all 5 tabs, sorts correctly, and hides draft rows', () => {
  const warnings: unknown[][] = [];
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => warnings.push(args);

  try {
    const result = parseSheetContent(SAMPLE_BUNDLE);

    // Categories sorted by order (1 before 2); draft category hidden
    assert.deepEqual(
      result.categories.map((c) => c.id),
      ['five-precepts', 'noble-eightfold-path']
    );

    // Five precepts items sorted by number; draft item 3 hidden; item id = category_id-number
    const five = result.categories[0];
    assert.deepEqual(
      five.items.map((i) => i.id),
      ['five-precepts-1', 'five-precepts-2']
    );
    assert.equal(five.items[0].example?.th, 'ช่วยพาแมลงออกจากห้องแทนการตี');
    assert.equal(five.items[0].example?.en, 'Gently carrying an insect outside.');

    // Sources sorted by order
    assert.deepEqual(
      five.sources.map((s) => s.text.th),
      ['พระไตรปิฎก (ฉบับหลวง)', 'พจนานุกรมพุทธศาสน์']
    );

    // Groups sorted by order; unknown group_id yields item without groupId
    const path = result.categories[1];
    assert.deepEqual(
      path.groups?.map((g) => g.id),
      ['wisdom', 'conduct']
    );
    assert.equal(path.items[0].groupId, 'wisdom');
    assert.equal(path.items[1].groupId, undefined);

    // CardClips sorted by clip_no (2 before 10); draft clip 3 hidden
    assert.deepEqual(
      result.cardClips.map((c) => c.clipNo),
      ['2', '10']
    );
    assert.equal(result.cardClips[0].category, 'สติ');

    // Unknown category_id rows logged warnings and did not crash
    assert.ok(
      warnings.some((w) => String(w[0]).includes('Items') && String(w[0]).includes('missing-category')),
      'Expected console.warn for unknown category_id in Items'
    );
  } finally {
    console.warn = origWarn;
  }
});

test('loader treats empty _en cells as missing so English falls back to Thai', () => {
  const origWarn = console.warn;
  console.warn = () => {};
  try {
    const result = parseSheetContent(SAMPLE_BUNDLE);
    const secondItem = result.categories[0].items[1];
    assert.equal(secondItem.pali.th, 'อทินนาทานา เวรมณี');
    assert.equal(secondItem.pali.en, undefined);
    assert.equal(secondItem.example?.th, 'ไม่หยิบของเพื่อนโดยไม่ขอ');
    assert.equal(secondItem.example?.en, undefined);

    const clipWithEmptyEn = result.cardClips[0];
    assert.equal(clipWithEmptyEn.title.th, 'หายใจเข้าออกอย่างรู้ตัว');
    assert.equal(clipWithEmptyEn.title.en, undefined);
  } finally {
    console.warn = origWarn;
  }
});

test('loader parses quoted Thai text with commas and line breaks accurately', () => {
  const origWarn = console.warn;
  console.warn = () => {};
  try {
    const result = parseSheetContent(SAMPLE_BUNDLE);
    const five = result.categories[0];
    assert.equal(five.intro.th, 'ข้อปฏิบัติพื้นฐาน, เพื่อความสงบ\nของตนเองและสังคม');
    assert.equal(
      five.items[0].shortMeaning.th,
      'เว้นจากการฆ่าสัตว์, และเบียดเบียนชีวิต\nทั้งทางกายและใจ'
    );
  } finally {
    console.warn = origWarn;
  }
});
