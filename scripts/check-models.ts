async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  const desiredModel = process.env.GEMINI_MODEL ?? "gemini-3-flash-preview";

  if (!key) {
    console.error("GEMINI_API_KEY is not set.");
    process.exitCode = 1;
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

  try {
    const response = await fetch(url);
    const data = (await response.json()) as {
      error?: { message?: string };
      models?: Array<{
        name: string;
        supportedGenerationMethods?: string[];
      }>;
    };

    if (!response.ok || !data.models) {
      console.error("Gemini model listing failed.", data.error?.message ?? data);
      process.exitCode = 1;
      return;
    }

    const availableNames = data.models.map((model) => model.name);
    const desiredCandidates = [
      desiredModel,
      `models/${desiredModel}`,
    ];
    const desiredAvailable = desiredCandidates.some((candidate) =>
      availableNames.includes(candidate),
    );

    console.log(`Configured model: ${desiredModel}`);
    console.log(`Configured model available: ${desiredAvailable ? "yes" : "no"}`);
    console.log("Available models:");
    for (const model of data.models) {
      const methods = model.supportedGenerationMethods?.join(", ") ?? "unknown";
      console.log(`- ${model.name} [${methods}]`);
    }

    if (!desiredAvailable) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Error fetching Gemini models:", error);
    process.exitCode = 1;
  }
}

listModels();
