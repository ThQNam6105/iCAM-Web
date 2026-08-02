import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Target,
  Compass,
  BookOpen,
  Headphones,
  Mic,
  Book,
  PenTool,
  Users,
  MessageSquare,
  Zap,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Globe,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';
import styles from './About.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';

export const About: React.FC = () => {
  const { t } = useLanguage();
  const [activeMethodTab, setActiveMethodTab] = useState<'4ls' | 'leti'>('4ls');
  const [activeComparison, setActiveComparison] = useState<'traditional' | 'cam'>('cam');

  return (
    <div className={styles.aboutWrapper}>
      {/* SECTION 1: HERO BANNER */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>{t.about.heroBadge}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t.about.heroTitlePrefix}
            <span className={styles.orangeHighlight}>
              {t.about.heroTitleHighlight}
            </span>
          </h1>

          <p className={styles.heroTagline}>
            {t.about.heroTagline}
          </p>

          <p className={styles.heroDescription}>
            {t.about.heroDescription}
          </p>

          <div className={styles.heroActions}>
            <a href="#methodology" className={styles.primaryHeroBtn}>
              {t.about.exploreMethodBtn} <ArrowRight size={18} />
            </a>
            <Link to="/contact" className={styles.secondaryHeroBtn}>
              {t.about.registerBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Transition: Hero (Navy) -> Mission (White) */}
      <SectionTransition variant="navy-to-white" />

      {/* SECTION 2: MISSION & 3 CORE DECLARATIONS */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Target size={16} />
              <span>{t.about.missionTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.about.missionTitlePrefix}
              <span className={styles.orangeText}>
                {t.about.missionTitleHighlight}
              </span>
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.about.missionSubtitle}
            </p>
          </div>

          {/* 3 Core Declarations Cards */}
          <div className={styles.declarationsGrid}>
            <div className={styles.declarationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.quoteBadge}>1</div>
                <MessageSquare size={24} className={styles.cardIcon} />
              </div>
              <h3 className={styles.declarationQuote}>
                "I can communicate in English."
              </h3>
              <p className={styles.declarationSub}>
                {t.about.declaration1Sub}
              </p>
              <p className={styles.declarationDesc}>
                {t.about.declaration1Desc}
              </p>
            </div>

            <div className={`${styles.declarationCard} ${styles.highlightCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.quoteBadge}>2</div>
                <Award size={24} className={styles.cardIcon} />
              </div>
              <h3 className={styles.declarationQuote}>
                "I can master English."
              </h3>
              <p className={styles.declarationSub}>
                {t.about.declaration2Sub}
              </p>
              <p className={styles.declarationDesc}>
                {t.about.declaration2Desc}
              </p>
            </div>

            <div className={styles.declarationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.quoteBadge}>3</div>
                <Lightbulb size={24} className={styles.cardIcon} />
              </div>
              <h3 className={styles.declarationQuote}>
                "I can learn English independently."
              </h3>
              <p className={styles.declarationSub}>
                {t.about.declaration3Sub}
              </p>
              <p className={styles.declarationDesc}>
                {t.about.declaration3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Mission (White) -> Core Values (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* SECTION 3: CORE VALUES */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Layers size={16} />
              <span>{t.about.valuesTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.about.valuesTitle}
            </h2>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <HeartHandshake size={28} />
              </div>
              <h3>{t.about.val1Title}</h3>
              <p>{t.about.val1Desc}</p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <BookOpen size={28} />
              </div>
              <h3>{t.about.val2Title}</h3>
              <p>{t.about.val2Desc}</p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <Award size={28} />
              </div>
              <h3>{t.about.val3Title}</h3>
              <p>{t.about.val3Desc}</p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <TrendingUp size={28} />
              </div>
              <h3>{t.about.val4Title}</h3>
              <p>{t.about.val4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Core Values (Soft Orange) -> Comparison (White) */}
      <SectionTransition variant="soft-orange-to-white" />

      {/* SECTION 4: WHY CHOOSE US (COMPARISON) */}
      <section className={styles.whyUsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Zap size={16} />
              <span>{t.about.whyTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.about.whyTitle}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.about.whySubtitle}
            </p>
          </div>

          {/* Interactive Toggle Switch */}
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleBtn} ${activeComparison === 'traditional' ? styles.activeToggle : ''}`}
              onClick={() => setActiveComparison('traditional')}
            >
              {t.about.tabTraditional}
            </button>
            <button
              className={`${styles.toggleBtn} ${activeComparison === 'cam' ? styles.activeToggleOrange : ''}`}
              onClick={() => setActiveComparison('cam')}
            >
              {t.about.tabCam}
            </button>
          </div>

          {/* Comparison Matrix */}
          <div className={styles.comparisonGrid}>
            <div className={`${styles.comparisonCard} ${styles.traditionalSide} ${activeComparison === 'traditional' ? styles.highlightedSide : ''}`}>
              <div className={styles.comparisonHeader}>
                <h3>{t.about.tradHeaderTitle}</h3>
                <span className={styles.badgeDanger}>{t.about.tradHeaderBadge}</span>
              </div>
              <ul className={styles.comparisonList}>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>{t.about.tradItem1}</span>
                </li>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>{t.about.tradItem2}</span>
                </li>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>{t.about.tradItem3}</span>
                </li>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>{t.about.tradItem4}</span>
                </li>
              </ul>
            </div>

            <div className={`${styles.comparisonCard} ${styles.camSide} ${activeComparison === 'cam' ? styles.highlightedSide : ''}`}>
              <div className={styles.comparisonHeader}>
                <h3>{t.about.camHeaderTitle}</h3>
                <span className={styles.badgeSuccess}>{t.about.camHeaderBadge}</span>
              </div>
              <ul className={styles.comparisonList}>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>{t.about.camItem1}</span>
                </li>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>{t.about.camItem2}</span>
                </li>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>{t.about.camItem3}</span>
                </li>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>{t.about.camItem4}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Comparison (White) -> Teaching Method (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* SECTION 5: TEACHING METHOD (4Ls + LETI) */}
      <section id="methodology" className={styles.methodSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <BookOpen size={16} />
              <span>{t.about.methodTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.about.methodTitlePrefix}
              <span className={styles.orangeText}>
                {t.about.methodTitleHighlight}
              </span>
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.about.methodSubtitle}
            </p>
          </div>

          {/* Method Tabs Navigation */}
          <div className={styles.methodTabs}>
            <button
              className={`${styles.methodTab} ${activeMethodTab === '4ls' ? styles.activeTab : ''}`}
              onClick={() => setActiveMethodTab('4ls')}
            >
              <Layers size={18} />
              <span>{t.about.tab4Ls}</span>
            </button>
            <button
              className={`${styles.methodTab} ${activeMethodTab === 'leti' ? styles.activeTab : ''}`}
              onClick={() => setActiveMethodTab('leti')}
            >
              <Cpu size={18} />
              <span>{t.about.tabLeti}</span>
            </button>
          </div>

          {/* Tab 1 Content: 4Ls */}
          {activeMethodTab === '4ls' && (
            <div className={styles.tabContentFade}>
              <div className={styles.fourLsGrid}>
                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><Headphones size={24} /></div>
                  <h4>{t.about.ls1Title}</h4>
                  <p>{t.about.ls1Desc}</p>
                </div>

                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><Mic size={24} /></div>
                  <h4>{t.about.ls2Title}</h4>
                  <p>{t.about.ls2Desc}</p>
                </div>

                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><Book size={24} /></div>
                  <h4>{t.about.ls3Title}</h4>
                  <p>{t.about.ls3Desc}</p>
                </div>

                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><PenTool size={24} /></div>
                  <h4>{t.about.ls4Title}</h4>
                  <p>{t.about.ls4Desc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2 Content: LETI */}
          {activeMethodTab === 'leti' && (
            <div className={styles.tabContentFade}>
              <div className={styles.letiBanner}>
                <h3>{t.about.letiBannerTitle}</h3>
                <p>{t.about.letiBannerSub}</p>
              </div>

              <div className={styles.letiGrid}>
                <div className={styles.letiCard}>
                  <Users size={22} className={styles.letiIcon} />
                  <div>
                    <h5>{t.about.letiItem1Title}</h5>
                    <p>{t.about.letiItem1Desc}</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <MessageSquare size={22} className={styles.letiIcon} />
                  <div>
                    <h5>{t.about.letiItem2Title}</h5>
                    <p>{t.about.letiItem2Desc}</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <Zap size={22} className={styles.letiIcon} />
                  <div>
                    <h5>{t.about.letiItem3Title}</h5>
                    <p>{t.about.letiItem3Desc}</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <Lightbulb size={22} className={styles.letiIcon} />
                  <div>
                    <h5>{t.about.letiItem4Title}</h5>
                    <p>{t.about.letiItem4Desc}</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <CheckCircle2 size={22} className={styles.letiIcon} />
                  <div>
                    <h5>{t.about.letiItem5Title}</h5>
                    <p>{t.about.letiItem5Desc}</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <Globe size={22} className={styles.letiIcon} />
                  <div>
                    <h5>{t.about.letiItem6Title}</h5>
                    <p>{t.about.letiItem6Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Transition: Teaching Method (Soft Orange) -> Smart Classrooms (Navy) */}
      <SectionTransition variant="soft-orange-to-navy" />

      {/* SECTION 6: 21ST CENTURY CLASSROOM */}
      <section className={styles.classroomSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Monitor size={16} />
              <span>{t.about.classroomTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.about.classroomTitle}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.about.classroomSubtitle}
            </p>
          </div>

          <div className={styles.classroomGrid}>
            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><Monitor size={32} /></div>
              <h3>{t.about.class1Title}</h3>
              <p>{t.about.class1Desc}</p>
            </div>

            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><BookOpen size={32} /></div>
              <h3>{t.about.class2Title}</h3>
              <p>{t.about.class2Desc}</p>
            </div>

            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><Cpu size={32} /></div>
              <h3>{t.about.class3Title}</h3>
              <p>{t.about.class3Desc}</p>
            </div>

            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><MessageSquare size={32} /></div>
              <h3>{t.about.class4Title}</h3>
              <p>{t.about.class4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Smart Classrooms (Navy) -> Student Journey (White) */}
      <SectionTransition variant="navy-to-white" />

      {/* SECTION 7: STUDENT JOURNEY */}
      <section className={styles.journeySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <TrendingUp size={16} />
              <span>{t.about.journeyTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.about.journeyTitle}
            </h2>
          </div>

          <div className={styles.journeySteps}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h4>{t.about.step1Title}</h4>
              <p>{t.about.step1Desc}</p>
            </div>

            <div className={styles.stepConnector}><ChevronRight size={24} /></div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h4>{t.about.step2Title}</h4>
              <p>{t.about.step2Desc}</p>
            </div>

            <div className={styles.stepConnector}><ChevronRight size={24} /></div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h4>{t.about.step3Title}</h4>
              <p>{t.about.step3Desc}</p>
            </div>

            <div className={styles.stepConnector}><ChevronRight size={24} /></div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>04</div>
              <h4>{t.about.step4Title}</h4>
              <p>{t.about.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Student Journey (White) -> Student Outcomes (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* SECTION 8: STUDENT OUTCOMES */}
      <section className={styles.outcomesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Award size={16} />
              <span>{t.about.outcomesTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.about.outcomesTitle}
            </h2>
          </div>

          <div className={styles.outcomesGrid}>
            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>{t.about.out1Title}</h4>
                <p>{t.about.out1Desc}</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>{t.about.out2Title}</h4>
                <p>{t.about.out2Desc}</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>{t.about.out3Title}</h4>
                <p>{t.about.out3Desc}</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>{t.about.out4Title}</h4>
                <p>{t.about.out4Desc}</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>{t.about.out5Title}</h4>
                <p>{t.about.out5Desc}</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>{t.about.out6Title}</h4>
                <p>{t.about.out6Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Outcomes (Soft Orange) -> Story (Navy) */}
      <SectionTransition variant="soft-orange-to-navy" />

      {/* SECTION 9: INNOVATION STORY */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyBox}>
            <div className={styles.storyContent}>
              <div className={styles.sectionTagLight}>
                <Compass size={16} />
                <span>{t.about.storyTag}</span>
              </div>
              <h2>{t.about.storyTitle}</h2>
              <p>{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Story (Navy) -> CTA (Soft Orange) */}
      <SectionTransition variant="navy-to-soft-orange" />

      {/* SECTION 10: CALL TO ACTION (CTA) */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>{t.about.ctaTitle}</h2>
            <p>{t.about.ctaDesc}</p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryCtaBtn}>
                {t.about.ctaPrimaryBtn} <ArrowRight size={18} />
              </Link>
              <Link to="/curriculum" className={styles.secondaryCtaBtn}>
                {t.about.ctaSecondaryBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
