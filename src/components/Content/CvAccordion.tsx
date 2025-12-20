import { useState } from 'react'
import { FiChevronDown, FiUser, FiBriefcase, FiBookOpen, FiMusic, FiAward, FiGlobe } from 'react-icons/fi'
import styles from './CvAccordion.module.css'
import type { BodyItem } from '@/data/pageConfig'

type CvAccordionProps = {
    body: BodyItem[]
}

type CvSection = {
    title: string
    icon: React.ReactNode
    items: BodyItem[]
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
    'Generale': <FiUser />,
    'Esperienza professionale': <FiBriefcase />,
    'Formazione': <FiBookOpen />,
    'Educazione musicale': <FiMusic />,
    'Masterclass di violoncello e di musica da camera effettuate': <FiAward />,
    'Educazione ed esperienze orchestrali': <FiMusic />,
    'Educazione generale': <FiBookOpen />,
    'Lingue parlate': <FiGlobe />,
}

export function CvAccordion({ body }: CvAccordionProps) {
    const sections: CvSection[] = []
    let currentSection: CvSection | null = null

    // Pre-process body to group by headings
    body.forEach((item) => {
        if (typeof item === 'object' && 'type' in item && item.type === 'heading') {
            currentSection = {
                title: item.content,
                icon: SECTION_ICONS[item.content] || <FiChevronDown />,
                items: []
            }
            sections.push(currentSection)
        } else if (currentSection) {
            currentSection.items.push(item)
        } else {
            // Items before the first heading (if any)
            if (sections.length === 0) {
                sections.push({
                    title: 'Introduzione',
                    icon: <FiUser />,
                    items: [item]
                })
            } else {
                sections[0].items.push(item)
            }
        }
    })

    return (
        <div className={styles.accordion}>
            {sections.map((section, idx) => (
                <CvSectionComponent key={idx} section={section} defaultOpen={idx === 0} />
            ))}
        </div>
    )
}

function CvSectionComponent({ section, defaultOpen }: { section: CvSection, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className={`${styles.section} ${isOpen ? styles.open : ''}`}>
            <button
                className={styles.header}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className={styles.icon}>{section.icon}</span>
                <span className={styles.title}>{section.title}</span>
                <FiChevronDown className={styles.chevron} />
            </button>

            <div className={styles.content}>
                <div className={styles.innerContent}>
                    {section.items.map((item, index) => {
                        if (typeof item === 'string') {
                            return <p key={index} className={styles.paragraph}>{item}</p>
                        }
                        if (typeof item === 'object' && 'type' in item && item.type === 'list') {
                            return (
                                <ul key={index} className={styles.list}>
                                    {item.items.map((listItem, liIdx) => (
                                        <li key={liIdx}>{listItem}</li>
                                    ))}
                                </ul>
                            )
                        }
                        return null
                    })}
                </div>
            </div>
        </div>
    )
}
