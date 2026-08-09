export default function About() {
  return (
    <div className="page">
      <h1>About</h1>

      <section className="about-section">
        <h2>Purpose</h2>
        <p>
          SohihFinder is a free, open-source reference tool for searching hadiths and checking their
          established scholarly grades. It aims to make authentic hadith reference accessible to
          everyone without cost or paywalls.
        </p>
      </section>

      <section className="about-section">
        <h2>Data Sources</h2>
        <ul>
          <li>
            <strong>fawazahmed0/hadith-api</strong> — open-source static JSON API served from jsDelivr
            CDN. Grades and references originate from established works used on Sunnah.com.
          </li>
          <li>
            <strong>AhmedBaset/hadith-json</strong> — open-source hadith dataset (50,884 hadiths,
            17 books, Arabic + English), intended for importing into a private MongoDB database for
            fully self-hosted operation.
          </li>
        </ul>
        <p className="muted">
          Grade sources include scholars such as Al-Albani, Shuaib Al-Arnaut, and the respective
          collection editors. Attribution is shown on each hadith where available.
        </p>
      </section>

      <section className="about-section">
        <h2>Disclaimer</h2>
        <p>
          This site displays grades that already exist in the source datasets. It does not issue new
          fatwas, religious rulings, or automated judgments about the authenticity of any hadith.
          All religious decisions should be made with the guidance of qualified scholars.
        </p>
      </section>

      <section className="about-section">
        <h2>Privacy & Cost</h2>
        <p>
          No paid AI APIs are used. No user accounts or personal data are required for search,
          browse, or verify features. The project runs entirely on free tiers.
        </p>
      </section>
    </div>
  );
}
