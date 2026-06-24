PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE avis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL,
    note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    url TEXT NOT NULL,
    chaine_nom TEXT,
    chaine_logo TEXT,
    chaine_abonnes TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
INSERT INTO avis VALUES(7,'omax.seduction',5,'J’ai eu l’occasion de travailler avec Ambre sur plusieurs projets vidéo et je suis très satisfait de son travail. Elle est réactive, professionnelle et comprend rapidement les attentes créatives. Au-delà de ses compétences techniques, Ambre sait apporter des idées pertinentes pour améliorer le rendu final et elle n’hésite pas à modifier les montages si besoin. C’est une monteuse fiable avec qui il est agréable de collaborer. Je la recommande sans hésitation.','https://www.tiktok.com/@omax.seduction','OMAX','https://yt3.ggpht.com/mUk5GyVrCACByeoFjepKtJe_RnHKMm9Ur37mRHe9TywnmZRJnuSOQVyqvUyjAl2UJaT1IU7I=s800-c-k-c0x00ffffff-no-rj','31200','2026-06-23 13:45:55');
INSERT INTO avis VALUES(8,'test',5,'c''est super','https://www.tiktok.com/@racontemoi.yt',NULL,NULL,NULL,'2026-06-23 13:53:26');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('avis',8);
COMMIT;
