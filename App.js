import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { WebView } from "react-native-webview";
import { manualIndex } from "./src/data/manualIndex";
import { sections, source } from "./src/data/manuals";

const logoUrl = "https://www.hosp.med.osaka-u.ac.jp/home/hp-infect/image/site-logo.png";
const webFrameStyle = {
  border: "0",
  flex: 1,
  width: "100%",
  minHeight: "70vh"
};

function normalize(value) {
  return value.toLowerCase().replace(/\s/g, "");
}

function getContentId(url) {
  if (!url) return null;
  const filename = url.split("/").pop() ?? "";
  return filename.replace(/\.pdf$/i, "");
}

function getManualContent(item) {
  const id = item.contentId ?? getContentId(item.url);
  return id ? manualIndex[id] : null;
}

function buildRows(activeSection, query) {
  const normalizedQuery = normalize(query);
  const visibleSections = activeSection === "all"
    ? sections
    : sections.filter((section) => section.id === activeSection);

  return visibleSections
    .map((section) => {
      const items = section.items.filter((item) => {
        if (!normalizedQuery) return true;
        const content = getManualContent(item);
        const target = `${section.label}${section.title}${item.title}${item.updatedAt ?? ""}${item.keywords ?? ""}${content?.searchText ?? ""}`;
        return normalize(target).includes(normalizedQuery);
      });
      return { ...section, items };
    })
    .filter((section) => section.items.length > 0);
}

async function openUrl(url) {
  if (!url) return;

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert("開けませんでした", "PDFを開けるアプリまたはブラウザを確認してください。");
    return;
  }
  await Linking.openURL(url);
}

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoBox}>
        <Image source={{ uri: logoUrl }} resizeMode="contain" style={styles.logo} />
      </View>
      <Text style={styles.eyebrow}>{source.organization}</Text>
      <Text style={styles.title}>{source.title}</Text>
      <Text style={styles.subtitle}>
        Word原稿から変換した本文・図表を、スマホで読みやすく確認できます。
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>最終更新: {source.lastUpdated}</Text>
        <Pressable style={styles.sourceButton} onPress={() => openUrl(source.sourceUrl)}>
          <Text style={styles.sourceButtonText}>公式ページ</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SectionFilter({ activeSection, setActiveSection }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
      <Pressable
        onPress={() => setActiveSection("all")}
        style={[styles.filterChip, activeSection === "all" && styles.filterChipActive]}
      >
        <Text style={[styles.filterText, activeSection === "all" && styles.filterTextActive]}>すべて</Text>
      </Pressable>
      {sections.map((section) => (
        <Pressable
          key={section.id}
          onPress={() => setActiveSection(section.id)}
          style={[styles.filterChip, activeSection === section.id && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, activeSection === section.id && styles.filterTextActive]}>{section.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function ManualItem({ item, section, onOpen }) {
  const content = getManualContent(item);
  const disabled = !content && !item.url;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onOpen({ item, section, content })}
      style={({ pressed }) => [
        styles.manualItem,
        disabled && styles.manualItemDisabled,
        pressed && styles.manualItemPressed
      ]}
    >
      <View style={styles.manualTextBlock}>
        <View style={styles.manualTitleRow}>
          <Text style={[styles.manualTitle, disabled && styles.manualTitleDisabled]}>{item.title}</Text>
          {item.isNew && <Text style={styles.newBadge}>new</Text>}
        </View>
        <View style={styles.itemMetaRow}>
          {item.updatedAt && <Text style={styles.itemMeta}>更新: {item.updatedAt}</Text>}
          {item.limited && <Text style={styles.limitedBadge}>院内限定</Text>}
          {content && <Text style={styles.itemMeta}>HTML</Text>}
          {!content && !item.limited && <Text style={styles.itemMeta}>PDF</Text>}
        </View>
      </View>
      <Text style={[styles.chevron, disabled && styles.chevronDisabled]}>{disabled ? "" : "読む"}</Text>
    </Pressable>
  );
}

function ManualSection({ section, onOpen }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{section.label}</Text>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      {section.items.map((item) => (
        <ManualItem key={`${section.id}-${item.title}`} item={item} section={section} onOpen={onOpen} />
      ))}
    </View>
  );
}

function HtmlContent({ content }) {
  if (!content?.htmlPath) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>本文データがありません</Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return React.createElement("iframe", {
      title: content.sourceName ?? "manual",
      src: content.htmlPath,
      style: webFrameStyle
    });
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: content.htmlPath }}
      style={styles.webView}
      setSupportMultipleWindows={false}
      scalesPageToFit
    />
  );
}

function DetailScreen({ selection, onBack }) {
  const { item, section, content } = selection;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.detailScreen}>
        <View style={styles.detailTopBar}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>戻る</Text>
          </Pressable>
          {item.url && (
            <Pressable style={styles.pdfButton} onPress={() => openUrl(item.url)}>
              <Text style={styles.pdfButtonText}>公式PDF</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.detailHeader}>
          <Text style={styles.detailSection}>{section.label} {section.title}</Text>
          <Text style={styles.detailTitle}>{item.title}</Text>
          <View style={styles.detailMetaRow}>
            {item.updatedAt && <Text style={styles.detailMeta}>更新: {item.updatedAt}</Text>}
            {content?.sourceName && <Text style={styles.detailMeta}>Word原稿</Text>}
            {item.isNew && <Text style={styles.newBadge}>new</Text>}
          </View>

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              Word原稿から変換したHTMLです。表は横スクロールできます。必要に応じて公式PDFも確認してください。
            </Text>
          </View>
        </View>

        <HtmlContent content={content} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [selection, setSelection] = useState(null);
  const rows = useMemo(() => buildRows(activeSection, query), [activeSection, query]);

  if (selection) {
    return <DetailScreen selection={selection} onBack={() => setSelection(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ManualSection section={item} onOpen={setSelection} />}
        ListHeaderComponent={
          <>
            <Header />
            <View style={styles.searchPanel}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="例: 標準予防策、COVID、VAP"
                placeholderTextColor="#7C8A86"
                style={styles.searchInput}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <SectionFilter activeSection={activeSection} setActiveSection={setActiveSection} />
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>該当する項目がありません</Text>
            <Text style={styles.emptyText}>キーワードを短くするか、章の絞り込みを「すべて」に戻してください。</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              掲載内容はWord原稿から変換したHTMLです。診療・感染対策の判断では、必要に応じて公式PDFの最新版も確認してください。
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F8F7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  listContent: {
    paddingBottom: 24
  },
  detailScreen: {
    flex: 1,
    backgroundColor: "#F5F8F7"
  },
  detailContent: {
    paddingBottom: 36
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#D9E4E1"
  },
  logoBox: {
    width: "100%",
    height: 42,
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 18
  },
  logo: {
    width: 260,
    height: 42
  },
  eyebrow: {
    color: "#18756B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8
  },
  title: {
    color: "#182A2A",
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800"
  },
  subtitle: {
    color: "#465A58",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 16
  },
  metaText: {
    color: "#526461",
    fontSize: 13,
    fontWeight: "600"
  },
  sourceButton: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  sourceButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800"
  },
  searchPanel: {
    backgroundColor: "#F5F8F7",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C9D8D4",
    borderRadius: 8,
    borderWidth: 1,
    color: "#172626",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14
  },
  filterContent: {
    gap: 8,
    paddingTop: 12,
    paddingBottom: 8
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C9D8D4",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  filterChipActive: {
    backgroundColor: "#CFE8E2",
    borderColor: "#0F766E"
  },
  filterText: {
    color: "#405451",
    fontSize: 13,
    fontWeight: "700"
  },
  filterTextActive: {
    color: "#0A4F49"
  },
  section: {
    marginHorizontal: 16,
    marginTop: 12
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8
  },
  sectionLabel: {
    backgroundColor: "#174E48",
    borderRadius: 6,
    color: "#FFFFFF",
    minWidth: 42,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800"
  },
  sectionTitle: {
    color: "#203332",
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22
  },
  manualItem: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE7E4",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 8,
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  manualItemDisabled: {
    backgroundColor: "#EEF3F1"
  },
  manualItemPressed: {
    backgroundColor: "#E3F1EE"
  },
  manualTextBlock: {
    flex: 1,
    gap: 8
  },
  manualTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  manualTitle: {
    color: "#172626",
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23
  },
  manualTitleDisabled: {
    color: "#687875"
  },
  itemMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  itemMeta: {
    color: "#60716E",
    fontSize: 12,
    fontWeight: "700"
  },
  newBadge: {
    backgroundColor: "#D92D20",
    borderRadius: 6,
    color: "#FFFFFF",
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: "900"
  },
  limitedBadge: {
    backgroundColor: "#E7ECEA",
    borderRadius: 6,
    color: "#5C6C69",
    overflow: "hidden",
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: "800"
  },
  chevron: {
    color: "#0F766E",
    fontSize: 13,
    fontWeight: "900"
  },
  chevronDisabled: {
    color: "#8A9996"
  },
  empty: {
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20
  },
  emptyTitle: {
    color: "#172626",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8
  },
  emptyText: {
    color: "#5B6D6A",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  footer: {
    marginHorizontal: 16,
    marginTop: 18,
    paddingBottom: 20
  },
  footerText: {
    color: "#657673",
    fontSize: 12,
    lineHeight: 19
  },
  detailTopBar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#D9E4E1",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  backButton: {
    backgroundColor: "#EEF3F1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  backButtonText: {
    color: "#174E48",
    fontSize: 14,
    fontWeight: "900"
  },
  pdfButton: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  pdfButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  detailSection: {
    color: "#18756B",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 20,
    marginTop: 0
  },
  detailTitle: {
    color: "#172626",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 34,
    marginTop: 6
  },
  detailHeader: {
    backgroundColor: "#F5F8F7",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12
  },
  detailMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  detailMeta: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9E4E1",
    borderRadius: 6,
    borderWidth: 1,
    color: "#526461",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "800"
  },
  noticeBox: {
    backgroundColor: "#E3F1EE",
    borderColor: "#BBD8D2",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 12
  },
  noticeText: {
    color: "#264946",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20
  },
  webView: {
    flex: 1,
    backgroundColor: "#F5F8F7"
  },
  htmlScrollContent: {
    paddingBottom: 24
  }
});
