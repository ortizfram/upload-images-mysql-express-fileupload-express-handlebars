export const createTable = `CREATE TABLE IF NOT EXISTS uploads (
    id INT NOT NULL AUTO_INCREMENT,
    thumbnail VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY(id),
);`;

export const createUpload = `
INSERT INTO uploads (thumbnail)
VALUES (?);
`;