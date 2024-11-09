const fetch = require("node-fetch");

exports.handler = async function () {
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = "Arda100";
    const repoName = "detaylar";
    const filePath = "detay.txt";

    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            headers: { Authorization: `token ${githubToken}` }
        });
        if (!response.ok) throw new Error("Dosya okuma hatası");

        const fileData = await response.json();
        const content = Buffer.from(fileData.content, "base64").toString("utf-8");

        return {
            statusCode: 200,
            body: JSON.stringify({ content })
        };
    } catch (error) {
        console.error("Hata:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Dosya okunurken bir hata oluştu." })
        };
    }
};
