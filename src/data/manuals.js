const BASE_URL = "https://www.hosp.med.osaka-u.ac.jp/home/hp-infect/file/manual";

export const source = {
  title: "感染管理マニュアル 院外版",
  organization: "大阪大学医学部附属病院 感染制御部",
  sourceUrl: "https://www.hosp.med.osaka-u.ac.jp/home/hp-infect/contents/manual_top.html",
  lastUpdated: "2026年4月"
};

export const sections = [
  {
    id: "1",
    label: "I",
    title: "院内感染対策のための指針",
    items: [
      { title: "院内感染対策のための指針", url: `${BASE_URL}/1.pdf` }
    ]
  },
  {
    id: "2",
    label: "II",
    title: "隔離予防策",
    items: [
      { title: "標準予防策", updatedAt: "2026.06", url: `${BASE_URL}/2-1.pdf` },
      { title: "感染経路別予防策", updatedAt: "2026.2.27", url: `${BASE_URL}/2-2.pdf` }
    ]
  },
  {
    id: "3",
    label: "III",
    title: "体液曝露対策",
    items: [
      { title: "防止対策", url: `${BASE_URL}/3-1.pdf` },
      { title: "発生時の対応", limited: true, updatedAt: "2025.11", contentId: "3-2" }
    ]
  },
  {
    id: "4",
    label: "IV",
    title: "洗浄・消毒・滅菌",
    items: [
      { title: "洗浄・消毒・滅菌について", updatedAt: "2025.6.16", url: `${BASE_URL}/4.pdf` },
      { title: "内視鏡の消毒", updatedAt: "2025.6.16", url: `${BASE_URL}/4.pdf` }
    ]
  },
  {
    id: "5",
    label: "V",
    title: "疾患別感染対策",
    items: [
      { title: "薬剤耐性菌", updatedAt: "2026.2.27", url: `${BASE_URL}/5-1.pdf` },
      { title: "結核", updatedAt: "2025.10.17", url: `${BASE_URL}/5-2ingai.pdf` },
      { title: "麻疹", updatedAt: "2025.6.16", url: `${BASE_URL}/5-3ingai.pdf` },
      { title: "水痘及び帯状疱疹", updatedAt: "2026.06", url: `${BASE_URL}/5-4ingai.pdf` },
      { title: "風疹", url: `${BASE_URL}/5-5ingai.pdf` },
      { title: "流行性耳下腺炎", url: `${BASE_URL}/5-6ingai.pdf` },
      { title: "流行性角結膜炎（EKC）", updatedAt: "2025.11.21", url: `${BASE_URL}/5-7ingai.pdf` },
      { title: "インフルエンザ", updatedAt: "2026.4.16", isNew: true, keywords: "flu", url: `${BASE_URL}/5-8ingai.pdf` },
      { title: "新型コロナウイルス感染症", updatedAt: "2026.4.16", isNew: true, keywords: "COVID COVID-19 corona SARS-CoV-2", url: `${BASE_URL}/5-9ingai.pdf` },
      { title: "感染性下痢症（O-157、ノロウィルスなど）", url: `${BASE_URL}/5-10ingai.pdf` },
      { title: "侵襲性髄膜炎菌感染症", url: `${BASE_URL}/5-11ingai.pdf` },
      { title: "SFTS", updatedAt: "2025.10.17", url: `${BASE_URL}/5-12ingai.pdf` },
      { title: "エムポックス", updatedAt: "2025.12.18", url: `${BASE_URL}/5-13ingai.pdf` },
      { title: "ニューモシスチス肺炎", updatedAt: "2026.2.27", url: `${BASE_URL}/5-14ingai.pdf` }
    ]
  },
  {
    id: "6",
    label: "VI",
    title: "侵襲処置・医療器具関連感染予防策",
    items: [
      { title: "CVカテーテル関連血流感染防止対策（CR-BSI）", updatedAt: "2025.6.16", url: `${BASE_URL}/6-1.pdf` },
      { title: "尿道留置カテーテル関連尿路感染予防策（CA-UTI）", updatedAt: "2025.6.16", url: `${BASE_URL}/6-2.pdf` },
      { title: "人工呼吸器関連肺炎防止対策（VAP）", updatedAt: "2026.4.16", isNew: true, url: `${BASE_URL}/6-3.pdf` },
      { title: "術後創感染予防策（SSI）", updatedAt: "2025.6.16", url: `${BASE_URL}/6-4.pdf` }
    ]
  },
  {
    id: "7",
    label: "VII",
    title: "院内環境整備",
    items: [
      { title: "院内清掃", url: `${BASE_URL}/7-1.pdf` },
      { title: "廃棄物", updatedAt: "2025.11.21", url: `${BASE_URL}/7-2.pdf` }
    ]
  },
  {
    id: "8",
    label: "VIII",
    title: "感染症に伴う届出事項",
    items: [
      { title: "感染症に伴う届出事項", url: `${BASE_URL}/8ingai.pdf` }
    ]
  },
  {
    id: "9",
    label: "IX",
    title: "ワクチン",
    items: [
      { title: "ワクチン", limited: true, updatedAt: "2025.8", contentId: "9" }
    ]
  },
  {
    id: "10",
    label: "X",
    title: "抗菌薬適正使用指針",
    items: [
      { title: "抗菌薬適正使用指針", updatedAt: "2026.2.27", url: `${BASE_URL}/10.pdf` }
    ]
  },
  {
    id: "11",
    label: "XI",
    title: "部門別感染対策",
    items: [
      { title: "部門別感染対策", url: `${BASE_URL}/11.pdf` }
    ]
  },
  {
    id: "12",
    label: "XII",
    title: "アウトブレイク（疑い）対応",
    items: [
      { title: "アウトブレイク（疑い）対応", limited: true, updatedAt: "2023.12", contentId: "12" }
    ]
  },
  {
    id: "revision",
    label: "改訂",
    title: "マニュアル改訂表",
    items: [
      { title: "マニュアル改訂表", url: `${BASE_URL}/kaitei.pdf` }
    ]
  }
];
