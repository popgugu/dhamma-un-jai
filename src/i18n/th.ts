import type { Dictionary } from './types';

export const th: Dictionary = {
  site: {
    title: 'ธรรมะอุ่นใจ',
    subtitle: 'ที่พึ่งทางใจ',
    welcome: 'ธรรมะเรียบง่าย เพื่อใจที่สงบ',
    footer: 'ธรรมะอุ่นใจ · เพื่อเป็นที่พึ่งทางใจ ไม่แสวงหากำไร',
  },
  nav: {
    home: 'หน้าแรก',
    completeTeachings: 'หมวดธรรม',
    cardTeachings: 'ธรรมะจากการ์ด',
    back: 'ย้อนกลับ',
    switchLanguage: 'เปลี่ยนภาษา',
    darkMode: 'เปลี่ยนเป็นโหมดกลางคืน',
    lightMode: 'เปลี่ยนเป็นโหมดกลางวัน',
  },
  home: {
    completeTitle: 'หมวดธรรม',
    completeDescription: 'รวมข้อธรรมครบทุกข้อในแต่ละหมวด พร้อมคำอธิบายเรียบง่ายและแหล่งอ้างอิง',
    cardsTitle: 'ธรรมะจากการ์ด',
    cardsDescription: 'ข้อธรรมจากการ์ดธรรมะ จัดเรียงตามหมวดหมู่เพื่อย้อนกลับมาทบทวน',
    categoriesCount: '{N} หมวด',
    teachingsCount: '{N} ข้อธรรม',
    comingSoonShort: 'เร็วๆ นี้',
    clipsCount: '{N} คลิป',
    openSection: 'เปิดอ่าน',
  },
  teachings: {
    title: 'หมวดธรรม',
    description: 'เลือกศึกษาข้อธรรมตามหมวดหมู่ ครบทุกข้อพร้อมคำแปลและความหมาย',
    itemCount: '{N} ข้อ',
    clipProgress: 'มีคลิปแล้ว {X} จาก {N}',
    viewCategory: 'อ่านรายละเอียด',
  },
  category: {
    translationNote: '',
    groupPrefix: 'กลุ่ม',
    relatedClips: 'คลิปที่เกี่ยวข้อง',
    noClipYet: 'ยังไม่มีคลิป',
    sources: 'แหล่งอ้างอิง',
    notFound: 'ไม่พบหมวดธรรมที่ค้นหา',
    backToList: 'กลับไปหน้าหมวดธรรม',
  },
  cards: {
    title: 'ธรรมะจากการ์ด',
    description: 'ข้อธรรมจากการ์ดธรรมะ จัดเรียงตามหมวดหมู่',
    emptyState: 'เร็วๆ นี้ — ธรรมะจากการ์ดจะทยอยเพิ่มเข้ามา',
    clipNumberPrefix: 'คลิปที่',
    uncategorized: 'หมวดอื่นๆ',
  },
  fallback: {
    shownInThai: '(แสดงเป็นภาษาไทย — กำลังจัดทำคำแปล)',
  },
};
