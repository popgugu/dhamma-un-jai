import type { LocalizedText } from './i18n/types';

export interface DharmaGroup {
  id: string;
  header: LocalizedText;
  label: LocalizedText;
  tone: 'saffron' | 'sage' | 'stone';
}

export interface DharmaItem {
  id: string;
  number: number;
  pali: LocalizedText;
  shortMeaning: LocalizedText;
  explanation: LocalizedText;
  example?: LocalizedText;
  groupId?: string;
}

export interface DharmaSource {
  id: string;
  text: LocalizedText;
}

export interface DharmaCategory {
  id: string;
  name: LocalizedText;
  intro: LocalizedText;
  groups?: DharmaGroup[];
  items: DharmaItem[];
  sources: DharmaSource[];
}

export interface CardClip {
  clipNo: string;
  date: string;
  category: LocalizedText;
  title: LocalizedText;
  quote?: LocalizedText;
  youtubeUrl?: string;
}

export const categories: DharmaCategory[] = [
  {
    id: 'five-precepts',
    name: {
      th: 'ศีล 5 (เบญจศีล)',
      en: 'The Five Precepts (Pañcasīla)',
    },
    intro: {
      th: 'ข้อปฏิบัติพื้นฐานของพุทธศาสนิกชน เพื่อความเป็นปกติสุขของตนเองและสังคม',
      en: 'The basic moral practice of Buddhist lay followers, for the peace and well-being of oneself and society.',
    },
    items: [
      {
        id: 'five-precepts-1',
        number: 1,
        pali: {
          th: 'ปาณาติปาตา เวรมณี',
          en: 'Pāṇātipātā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการฆ่าสัตว์และเบียดเบียนชีวิต',
          en: 'Abstaining from killing and harming living beings',
        },
        explanation: {
          th: 'เคารพในชีวิตของผู้อื่น',
          en: 'Respect for the lives of others.',
        },
      },
      {
        id: 'five-precepts-2',
        number: 2,
        pali: {
          th: 'อทินนาทานา เวรมณี',
          en: 'Adinnādānā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการลักทรัพย์',
          en: 'Abstaining from taking what is not given',
        },
        explanation: {
          th: 'เคารพในทรัพย์สินของผู้อื่น',
          en: 'Respect for the property of others.',
        },
      },
      {
        id: 'five-precepts-3',
        number: 3,
        pali: {
          th: 'กาเมสุมิจฉาจารา เวรมณี',
          en: 'Kāmesu micchācārā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการประพฤติผิดในกาม',
          en: 'Abstaining from sexual misconduct',
        },
        explanation: {
          th: 'เคารพในคู่ครองและคนรักของผู้อื่น',
          en: 'Respect for the partners and loved ones of others.',
        },
      },
      {
        id: 'five-precepts-4',
        number: 4,
        pali: {
          th: 'มุสาวาทา เวรมณี',
          en: 'Musāvādā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการพูดเท็จ',
          en: 'Abstaining from false speech',
        },
        explanation: {
          th: 'ซื่อตรงและจริงใจต่อกัน',
          en: 'Honesty and sincerity with one another.',
        },
      },
      {
        id: 'five-precepts-5',
        number: 5,
        pali: {
          th: 'สุราเมรยมัชชปมาทัฏฐานา เวรมณี',
          en: 'Surāmeraya-majja-pamādaṭṭhānā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการดื่มน้ำเมาและสิ่งเสพติดอันเป็นเหตุแห่งความประมาท',
          en: 'Abstaining from alcohol and intoxicants that lead to heedlessness',
        },
        explanation: {
          th: 'รักษาสติให้ตื่นรู้',
          en: 'Keeping the mind clear and aware.',
        },
      },
    ],
    sources: [
      {
        id: 'five-precepts-src-1',
        text: {
          th: 'พระไตรปิฎก (ฉบับหลวง): อังคุตตรนิกาย ปัญจกนิบาต',
          en: 'Thai Royal Edition Tipiṭaka: Aṅguttara Nikāya, Book of the Fives',
        },
      },
      {
        id: 'five-precepts-src-2',
        text: {
          th: 'พจนานุกรมพุทธศาสน์ ฉบับประมวลธรรม — พระพรหมคุณาภรณ์ (ป.อ. ปยุตฺโต)',
          en: 'Dictionary of Buddhism — Phra Brahmagunabhorn (P. A. Payutto)',
        },
      },
    ],
  },
  {
    id: 'eight-precepts',
    name: {
      th: 'ศีล 8 (อุโบสถศีล)',
      en: 'The Eight Precepts (Uposatha Sīla)',
    },
    intro: {
      th: 'ศีลที่อุบาสกอุบาสิกาสมาทานรักษาเป็นครั้งคราว เช่น ในวันพระ เพื่อขัดเกลากิเลสให้ละเอียดยิ่งกว่าศีล 5',
      en: 'Precepts that lay followers undertake on special occasions, such as Buddhist holy days (Wan Phra), to refine the mind beyond the Five Precepts.',
    },
    items: [
      {
        id: 'eight-precepts-1',
        number: 1,
        pali: {
          th: 'ปาณาติปาตา เวรมณี',
          en: 'Pāṇātipātā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการฆ่าสัตว์และเบียดเบียนชีวิต',
          en: 'Abstaining from killing and harming living beings',
        },
        explanation: {
          th: 'เคารพในชีวิตของผู้อื่น',
          en: 'Respect for the lives of others.',
        },
      },
      {
        id: 'eight-precepts-2',
        number: 2,
        pali: {
          th: 'อทินนาทานา เวรมณี',
          en: 'Adinnādānā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการลักทรัพย์',
          en: 'Abstaining from taking what is not given',
        },
        explanation: {
          th: 'เคารพในทรัพย์สินของผู้อื่น',
          en: 'Respect for the property of others.',
        },
      },
      {
        id: 'eight-precepts-3',
        number: 3,
        pali: {
          th: 'อพรหมจริยา เวรมณี',
          en: 'Abrahmacariyā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการประพฤติผิดพรหมจรรย์ (เว้นจากเพศสัมพันธ์)',
          en: 'Abstaining from all sexual activity (celibacy)',
        },
        explanation: {
          th: 'ฝึกความสำรวมกายและใจ',
          en: 'Training restraint of body and mind.',
        },
      },
      {
        id: 'eight-precepts-4',
        number: 4,
        pali: {
          th: 'มุสาวาทา เวรมณี',
          en: 'Musāvādā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการพูดเท็จ',
          en: 'Abstaining from false speech',
        },
        explanation: {
          th: 'ซื่อตรงและจริงใจต่อกัน',
          en: 'Honesty and sincerity with one another.',
        },
      },
      {
        id: 'eight-precepts-5',
        number: 5,
        pali: {
          th: 'สุราเมรยมัชชปมาทัฏฐานา เวรมณี',
          en: 'Surāmeraya-majja-pamādaṭṭhānā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการดื่มน้ำเมาและสิ่งเสพติดอันเป็นเหตุแห่งความประมาท',
          en: 'Abstaining from alcohol and intoxicants that lead to heedlessness',
        },
        explanation: {
          th: 'รักษาสติให้ตื่นรู้',
          en: 'Keeping the mind clear and aware.',
        },
      },
      {
        id: 'eight-precepts-6',
        number: 6,
        pali: {
          th: 'วิกาลโภชนา เวรมณี',
          en: 'Vikālabhojanā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการบริโภคอาหารในเวลาวิกาล (หลังเที่ยงวันจนถึงรุ่งอรุณ)',
          en: 'Abstaining from eating at the wrong time (from noon until dawn)',
        },
        explanation: {
          th: 'ฝึกความพอดีและลดความอยาก',
          en: 'Training moderation and lessening craving.',
        },
      },
      {
        id: 'eight-precepts-7',
        number: 7,
        pali: {
          th: 'นัจจคีตวาทิตวิสูกทัสสนา มาลาคันธวิเลปนธารณมัณฑนวิภูสนัฏฐานา เวรมณี',
          en: 'Nacca-gīta-vādita-visūkadassana mālā-gandha-vilepana-dhāraṇa-maṇḍana-vibhūsanaṭṭhānā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากการฟ้อนรำ ขับร้อง ประโคมดนตรี ดูการละเล่น และการทัดทรงดอกไม้ ของหอม เครื่องลูบไล้ ประดับตกแต่ง',
          en: 'Abstaining from dancing, singing, music and shows, and from wearing garlands, perfumes, cosmetics and adornments',
        },
        explanation: {
          th: 'ลดสิ่งเร้าให้ใจสงบ',
          en: 'Reducing stimulation so the mind can be calm.',
        },
      },
      {
        id: 'eight-precepts-8',
        number: 8,
        pali: {
          th: 'อุจจาสยนมหาสยนา เวรมณี',
          en: 'Uccāsayana-mahāsayanā veramaṇī',
        },
        shortMeaning: {
          th: 'เว้นจากที่นอนที่นั่งสูงใหญ่ หรูหรา',
          en: 'Abstaining from high and luxurious seats and beds',
        },
        explanation: {
          th: 'ฝึกความเรียบง่ายและไม่ยึดติดความสบาย',
          en: 'Training simplicity and letting go of attachment to comfort.',
        },
      },
    ],
    sources: [
      {
        id: 'eight-precepts-src-1',
        text: {
          th: 'พระไตรปิฎก (ฉบับหลวง): อังคุตตรนิกาย อัฏฐกนิบาต (อุโปสถสูตร)',
          en: 'Thai Royal Edition Tipiṭaka: Aṅguttara Nikāya, Book of the Eights (Uposatha Sutta)',
        },
      },
      {
        id: 'eight-precepts-src-2',
        text: {
          th: 'พจนานุกรมพุทธศาสน์ ฉบับประมวลธรรม — พระพรหมคุณาภรณ์ (ป.อ. ปยุตฺโต)',
          en: 'Dictionary of Buddhism — Phra Brahmagunabhorn (P. A. Payutto)',
        },
      },
    ],
  },
  {
    id: 'noble-eightfold-path',
    name: {
      th: 'มรรคมีองค์ 8 (อริยมรรคมีองค์ 8)',
      en: 'The Noble Eightfold Path (Ariya Aṭṭhaṅgika Magga)',
    },
    intro: {
      th: 'ทางสายกลางสู่ความดับทุกข์ เป็นข้อที่ 4 ของอริยสัจ 4 (มรรค) จัดเป็น 3 กลุ่มตามไตรสิกขา คือ ปัญญา ศีล และสมาธิ',
      en: 'The Middle Way leading to the end of suffering — the fourth of the Four Noble Truths. Its eight factors fall into the three trainings: wisdom, ethical conduct, and concentration.',
    },
    groups: [
      {
        id: 'wisdom',
        header: {
          th: 'ปัญญา',
          en: 'Wisdom (Paññā)',
        },
        label: {
          th: 'ปัญญา',
          en: 'Wisdom',
        },
        tone: 'saffron',
      },
      {
        id: 'conduct',
        header: {
          th: 'ศีล',
          en: 'Ethical Conduct (Sīla)',
        },
        label: {
          th: 'ศีล',
          en: 'Ethical Conduct',
        },
        tone: 'sage',
      },
      {
        id: 'concentration',
        header: {
          th: 'สมาธิ',
          en: 'Concentration (Samādhi)',
        },
        label: {
          th: 'สมาธิ',
          en: 'Concentration',
        },
        tone: 'stone',
      },
    ],
    items: [
      {
        id: 'noble-eightfold-path-1',
        number: 1,
        pali: {
          th: 'สัมมาทิฏฐิ',
          en: 'Sammā-diṭṭhi',
        },
        shortMeaning: {
          th: 'ความเห็นชอบ',
          en: 'Right View',
        },
        explanation: {
          th: 'เข้าใจสิ่งทั้งหลายตามความเป็นจริง คือเข้าใจอริยสัจ 4: ทุกข์ เหตุแห่งทุกข์ ความดับทุกข์ และทางดับทุกข์',
          en: 'Seeing things as they truly are: understanding the Four Noble Truths — suffering, its cause, its cessation, and the path to its cessation.',
        },
        groupId: 'wisdom',
      },
      {
        id: 'noble-eightfold-path-2',
        number: 2,
        pali: {
          th: 'สัมมาสังกัปปะ',
          en: 'Sammā-saṅkappa',
        },
        shortMeaning: {
          th: 'ความดำริชอบ',
          en: 'Right Intention',
        },
        explanation: {
          th: 'คิดออกจากกาม คิดไม่พยาบาท คิดไม่เบียดเบียน',
          en: 'Thoughts of renunciation, of goodwill, and of harmlessness.',
        },
        groupId: 'wisdom',
      },
      {
        id: 'noble-eightfold-path-3',
        number: 3,
        pali: {
          th: 'สัมมาวาจา',
          en: 'Sammā-vācā',
        },
        shortMeaning: {
          th: 'เจรจาชอบ',
          en: 'Right Speech',
        },
        explanation: {
          th: 'เว้นจากการพูดเท็จ พูดส่อเสียด พูดคำหยาบ และพูดเพ้อเจ้อ',
          en: 'Abstaining from lying, divisive speech, harsh speech, and idle chatter.',
        },
        groupId: 'conduct',
      },
      {
        id: 'noble-eightfold-path-4',
        number: 4,
        pali: {
          th: 'สัมมากัมมันตะ',
          en: 'Sammā-kammanta',
        },
        shortMeaning: {
          th: 'กระทำชอบ',
          en: 'Right Action',
        },
        explanation: {
          th: 'เว้นจากการฆ่า การลักทรัพย์ และการประพฤติผิดในกาม',
          en: 'Abstaining from killing, stealing, and sexual misconduct.',
        },
        groupId: 'conduct',
      },
      {
        id: 'noble-eightfold-path-5',
        number: 5,
        pali: {
          th: 'สัมมาอาชีวะ',
          en: 'Sammā-ājīva',
        },
        shortMeaning: {
          th: 'เลี้ยงชีพชอบ',
          en: 'Right Livelihood',
        },
        explanation: {
          th: 'ละมิจฉาชีพ เลี้ยงชีวิตด้วยอาชีพสุจริต',
          en: 'Giving up wrong livelihood and earning a living honestly.',
        },
        groupId: 'conduct',
      },
      {
        id: 'noble-eightfold-path-6',
        number: 6,
        pali: {
          th: 'สัมมาวายามะ',
          en: 'Sammā-vāyāma',
        },
        shortMeaning: {
          th: 'เพียรชอบ',
          en: 'Right Effort',
        },
        explanation: {
          th: 'เพียรระวังไม่ให้บาปเกิด เพียรละบาปที่เกิดแล้ว เพียรทำกุศลให้เกิด และเพียรรักษากุศลที่เกิดแล้ว',
          en: 'Effort to prevent unwholesome states from arising, to abandon those that have arisen, to develop wholesome states, and to sustain those that have arisen.',
        },
        groupId: 'concentration',
      },
      {
        id: 'noble-eightfold-path-7',
        number: 7,
        pali: {
          th: 'สัมมาสติ',
          en: 'Sammā-sati',
        },
        shortMeaning: {
          th: 'ระลึกชอบ',
          en: 'Right Mindfulness',
        },
        explanation: {
          th: 'ตั้งสติพิจารณากาย เวทนา จิต และธรรม (สติปัฏฐาน 4)',
          en: 'Mindful contemplation of the body, feelings, mind, and mental phenomena (the Four Foundations of Mindfulness).',
        },
        groupId: 'concentration',
      },
      {
        id: 'noble-eightfold-path-8',
        number: 8,
        pali: {
          th: 'สัมมาสมาธิ',
          en: 'Sammā-samādhi',
        },
        shortMeaning: {
          th: 'ตั้งจิตมั่นชอบ',
          en: 'Right Concentration',
        },
        explanation: {
          th: 'จิตตั้งมั่นแน่วแน่เป็นสมาธิ',
          en: 'A steady, unified, and collected mind.',
        },
        groupId: 'concentration',
      },
    ],
    sources: [
      {
        id: 'noble-eightfold-path-src-1',
        text: {
          th: 'พระไตรปิฎก (ฉบับหลวง): ธัมมจักกัปปวัตตนสูตร และ มหาสติปัฏฐานสูตร',
          en: 'Thai Royal Edition Tipiṭaka: Dhammacakkappavattana Sutta and Mahāsatipaṭṭhāna Sutta',
        },
      },
      {
        id: 'noble-eightfold-path-src-2',
        text: {
          th: 'พจนานุกรมพุทธศาสน์ ฉบับประมวลธรรม — พระพรหมคุณาภรณ์ (ป.อ. ปยุตฺโต)',
          en: 'Dictionary of Buddhism — Phra Brahmagunabhorn (P. A. Payutto)',
        },
      },
    ],
  },
];

export const cardClips: CardClip[] = [];
