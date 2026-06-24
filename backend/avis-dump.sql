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
INSERT INTO avis VALUES(1,'squeezie',5,'Top','https://www.youtube.com/@Squeezie','SQUEEZIE','https://yt3.ggpht.com/ytc/AIdro_mPZvx-xk6pbAYdC7G8jUZzgCNDDTg1ZfF0_Lwd8UpJT4M=s800-c-k-c0x00ffffff-no-rj','20100000','2026-06-23 10:26:21');
INSERT INTO avis VALUES(2,'mrbeast',4,'Montage carré et efficace, le rythme tient du début à la fin. Bon boulot, je reviendrai pour mes prochaines vidéos sans hésiter.','https://www.youtube.com/@MrBeast','MrBeast','https://yt3.ggpht.com/nxYrc_1_2f77DoBadyxMTmv7ZpRZapHR5jbuYe7PlPd5cIRJxtNNEYyOC0ZsxaDyJJzXrnJiuDE=s800-c-k-c0x00ffffff-no-rj','504000000','2026-06-23 10:27:21');
INSERT INTO avis VALUES(3,'michou',4,'Travail vraiment exceptionnel du début à la fin. Le montage est dynamique, les transitions tombent pile sur la musique, le sound design est immersif et la colorimétrie sublime chaque plan. On sent un vrai souci du détail à chaque seconde. Je recommande à 100% à tout créateur qui cherche un monteur sérieux, créatif et fiable, capable de transformer des rushs bruts en une vidéo qui capte et garde l attention jusqu au bout.','https://www.youtube.com/@Michou','Michou','https://yt3.ggpht.com/AbT6_C0E4bzscwpKqfdeMg6wTCuo_5pP9lkeqcLBFtqbgJsf8GaRGBAUnf7ZuNwEuiTHA7fI=s800-c-k-c0x00ffffff-no-rj','10900000','2026-06-23 11:12:44');
INSERT INTO avis VALUES(4,'jean_dupont',5,'Super collaboration, à refaire !','https://www.youtube.com/@chaine-inexistante-xyz999',NULL,NULL,NULL,'2026-06-23 11:14:46');
INSERT INTO avis VALUES(5,'lea_market',5,'Je cherchais quelqu un capable de donner du rythme à mes vlogs sans dénaturer mon style, et c est exactement ce que j ai eu. Communication fluide, délais respectés, et un rendu au-dessus de mes attentes. Franchement bravo.','https://www.youtube.com/@pas-une-vraie-chaine-123',NULL,NULL,NULL,'2026-06-23 11:15:50');
INSERT INTO avis VALUES(6,'tom',3,'Correct','https://www.youtube.com/@notfound-azerty',NULL,NULL,NULL,'2026-06-23 11:16:38');
INSERT INTO avis VALUES(7,'amixem',5,'Excellent, rien à redire.','https://www.youtube.com/@Amixem','Amixem','https://yt3.ggpht.com/mkxR4YNTUBJAjuq020488wM8yHSCZ4Kwn0etJyYyGTL86LnEiIzu5uhw8EwmPpRxavKYXyQ4Hmk=s800-c-k-c0x00ffffff-no-rj','9390000','2026-06-23 11:17:33');
INSERT INTO avis VALUES(8,'sofia',2,'Pas mal mais quelques coupes un peu sèches à mon goût, sinon le travail reste propre et livré dans les temps','https://www.youtube.com/@inexistant-test-0000',NULL,NULL,NULL,'2026-06-23 11:18:14');
INSERT INTO avis VALUES(11,'test',5,'kdoewkd','http://google.fr','Undefined','https://yt3.ggpht.com/dLHdx9gnMUMqdYnrZ26atHPNfJRIn8t8Q-bF_5I3KmpFFVF-TdBE86A96It6yZYsaAre-AUM=s800-c-k-c0x00ffffff-no-rj','297','2026-06-23 12:47:33');
INSERT INTO avis VALUES(12,'Ego',5,'super sorc du beau boulot ','https://www.youtube.com/@ego_one','EGO','https://yt3.ggpht.com/7wKgNZReKXMVuRP11m-o1-6yV5YU31l_BmozxJgG457ngwWSN9a02iE4YaMyKhHsDl6ViZ5uCg=s800-c-k-c0x00ffffff-no-rj','1350000','2026-06-23 12:48:38');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('avis',12);
COMMIT;
