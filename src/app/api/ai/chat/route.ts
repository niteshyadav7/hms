import { NextRequest } from "next/server";
import { LuminaReActAgent } from "@/lib/ai/react-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message || (Array.isArray(body.messages) && body.messages[body.messages.length - 1]?.content);
    const userEmail = body.userEmail;

    if (!userMessage || typeof userMessage !== "string") {
      return new Response(JSON.stringify({ success: false, error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize Lumina ReAct Agent
    const reactAgent = new LuminaReActAgent();
    const agentResponse = await reactAgent.processGoal(userMessage, userEmail);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          replyText: agentResponse.replyText,
          actionType: agentResponse.actionType,
          payloadData: agentResponse.payloadData,
          directLink: agentResponse.directLink,
          thoughtProcess: agentResponse.thoughtProcess,
          actionExecuted: agentResponse.actionExecuted,
          groundednessScore: agentResponse.groundednessScore,
          isSafe: agentResponse.isSafe,
          citations: agentResponse.citations,
          source: "LUMINA_REACT_AGENTIC_ENGINE",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
