
const form = document.getElementById("gig-form");
const generateButton = document.getElementById("generate-btn");
const results = document.getElementById("results");
const resultContent = document.getElementById("result-content");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    const data = {
        skills: formData.get("skills").trim(),
        experience: formData.get("experience"),
        budget: formData.get("budget"),
        client: formData.get("client").trim(),
        requirements: formData.get("requirements").trim()
    };

    generateButton.disabled = true;
    generateButton.textContent = "Generating your gig...";
    results.classList.remove("hidden");
    resultContent.replaceChildren();

    const loading = document.createElement("p");
    loading.textContent = "Your AI pitch is being prepared. Please wait...";
    resultContent.appendChild(loading);

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to generate your pitch.");
        }

        resultContent.replaceChildren();

        const sections = [
            ["Service Idea", result.serviceIdea],
            ["Suggested Pricing", result.pricing],
            ["Client Proposal", result.proposal],
            ["First-Customer Message", result.outreach]
        ];

        sections.forEach(([heading, content]) => {
            const card = document.createElement("article");
            card.className = "result-card";

            const title = document.createElement("h3");
            title.textContent = heading;

            const paragraph = document.createElement("p");
            paragraph.textContent = content || "No content returned.";

            card.append(title, paragraph);
            resultContent.appendChild(card);
        });

        results.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        resultContent.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            error.message +
            " Check that the server and Ollama model are running, then try again.";

        resultContent.appendChild(message);

    } finally {
        generateButton.disabled = false;
        generateButton.innerHTML = 'Generate My Gig <span>↗</span>';
    }
});
