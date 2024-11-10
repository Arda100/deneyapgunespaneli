
exports.handler = async function (event, context) {
    const fetch = await import('node-fetch');
    
    // `msg` parametresini alın
    const msg = event.queryStringParameters.msg;
    if (!msg) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Lütfen 'msg' parametresi sağlayın." }),
        };
    }

    const githubToken = process.env.GITHUB_TOKEN;  // GitHub API erişim belirteci
    const repoOwner = "Arda100";
    const repoName = "detaylar";
    const filePath = "detay.txt";  // Dosyanın GitHub’daki yolu

    // Dosyayı GitHub API ile güncelleyin
    try {
        // Mevcut dosya içeriğini alın (güncelleme için mevcut dosya SHA’sına ihtiyaç var)
        const fileResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            headers: { Authorization: `token ${githubToken}` }
        });
        const fileData = await fileResponse.json();
        const sha = fileData.sha;  // Mevcut dosya SHA’sı

        // Yeni içeriği base64 formatında güncelleyin
        const newContent = Buffer.from(msg).toString("base64");

        // GitHub’da dosyayı güncelleyin
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${githubToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Yeni veri eklendi",
                content: newContent,
                sha: sha
            })
        });

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Dosya başarıyla güncellendi" })
            };
        } else {
            throw new Error("Dosya güncelleme başarısız oldu.");
        }
    } catch (error) {
        console.error("Hata:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Dosya güncellenirken bir hata oluştu." })
        };
    }
};
