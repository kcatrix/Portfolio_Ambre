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
INSERT INTO avis VALUES(7,'omax.seduction',5,'J’ai eu l’occasion de travailler avec Ambre sur plusieurs projets vidéo et je suis très satisfait de son travail. Elle est réactive, professionnelle et comprend rapidement les attentes créatives. Au-delà de ses compétences techniques, Ambre sait apporter des idées pertinentes pour améliorer le rendu final et elle n’hésite pas à modifier les montages si besoin. C’est une monteuse fiable avec qui il est agréable de collaborer. Je la recommande sans hésitation.','https://www.tiktok.com/@omax.seduction','OMAX','/omax.jpeg','31200','2026-06-23 13:45:55');
INSERT INTO avis VALUES(13,'Vlad_CKA',5,'Je suis très content du travail que fait Ambre ! J''ai dû changer de monteur au mois d''Aout, et j''avais un peu peur de perdre ma DA habituelle avec mon ancien monteur vidéo. Mais Ambre a su me retirer cette peur en fournissant une qualité de montage exceptionnelle ! Disponible, à l''écoute, créative et rapide, je suis plus que satisfait de travailler avec Ambre sur le montage de mes vidéos ! ','https://www.youtube.com/@vlad_cka','Vlad''','https://yt3.ggpht.com/MdsoUgw67-d6ejPKmehieUaNQLdIyg8tqzMjTQ4SygCBzS57bMu4Ia3SMUbovuYYAaURpSwIGw=s800-c-k-c0x00ffffff-no-rj','14800','2026-10-06 19:43:56');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('avis',19);
COMMIT;
