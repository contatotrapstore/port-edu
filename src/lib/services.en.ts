import type { Locale } from "@/lib/locale";
import { serviceCases, services, type ServiceCase, type ServicePage } from "@/lib/services";

/**
 * English versions of the service pages. Same slugs, same structure and the
 * same claims as the Portuguese pages in services.ts (the source of truth):
 * this file only translates them. Keep both in sync when one changes.
 */
const serviceCasesEN: Record<string, ServiceCase> = {
  passagenseuropa: {
    ...serviceCases.passagenseuropa,
    description: "A CRM that brings together leads, customer support, quotes, finance and commissions for a sales operation.",
    imageAlt: "Customer support board in the Passagens Europa CRM",
    caption: "Support pipeline and CRM modules, cropped from the project presentation.",
  },
  mudapaisagens: {
    ...serviceCases.mudapaisagens,
    description: "AI pre-sales conversations, qualification questions and records in Pipefy, integrated through Make.",
    imageAlt: "Muda Paisagens lead qualification workflow in Make",
    caption: "Steps of the qualification workflow configured in Make, from the existing project screenshot.",
  },
  clinafy: {
    ...serviceCases.clinafy,
    description: "A mental health platform with clinical records, scheduling, telehealth and financial management.",
    imageAlt: "Electronic records module in the Clinafy presentation",
    caption: "Detail from the Clinafy presentation: electronic records features. The image describes the product.",
  },
};

const servicesEN: ServicePage[] = [
  {
    slug: "sistemas-sob-medida",
    name: "Custom systems",
    metadataTitle: "Custom system development | Eduardo Gouveia",
    metadataDescription: "Management systems, CRMs and dashboards for your company’s operations. See scope examples, acceptance criteria and Eduardo Gouveia’s portfolio.",
    title: "Custom systems for the way your company works.",
    intro: "I build custom management systems, CRMs and dashboards. The starting point is understanding who uses the process, which rules it must follow and what is currently scattered across spreadsheets and tools.",
    indexDescription: "To organize your own workflow: records, stages, owners, permissions and tracking in one system.",
    caseId: "passagenseuropa",
    fitTitle: "When the workflow doesn’t fit your current tools.",
    fit: [
      "The same information is retyped in different trackers and nobody knows which one is up to date.",
      "The operation has stages, approvals or exceptions that the current tool cannot represent.",
      "There is a system in use, but it lacks a module or a view for the people who follow the work.",
    ],
    decisionTitle: "Build a whole system or complete what already exists?",
    decision: "The first decision is the size of the intervention. Sometimes integrating tools or adding a module is enough. When the operation’s rules require an application of its own, I separate the essential flow from the improvements that can wait for another stage. That defines a scope that can be described and validated.",
    scopeTitle: "The scope starts with the work that needs to happen.",
    scopeExamples: [
      {
        title: "Stages and owners",
        description: "Represent a sales or operational process, with states, owners and a history of changes.",
        acceptance: "An authorized user moves a record between the agreed stages; the system records who changed it and when.",
      },
      {
        title: "Access roles",
        description: "Define what each role can view, create and change, based on the real workflow.",
        acceptance: "The allowed actions work for each role; unauthorized operations are also blocked on the server.",
      },
      {
        title: "Dashboards and queries",
        description: "Organize the information the team needs to follow pending items and make decisions.",
        acceptance: "Filters and totals are checked against a known set of records, including cases with no results.",
      },
      {
        title: "Imports and integrations",
        description: "Plan how existing data comes in and how the system relates to services that stay in use, when that is part of the project.",
        acceptance: "A sample is imported and checked; duplicates and invalid data get the agreed treatment.",
      },
    ],
    process: [
      { title: "Map the workflow", description: "Understand a concrete flow, its users, documents and exceptions. Identify what can already be reused." },
      { title: "Define screens and rules", description: "Agree on deliverables, permissions, acceptance criteria and dependencies before development." },
      { title: "Validate in stages", description: "Show the flow working so it can be checked against real scenarios from the operation." },
      { title: "Prepare the delivery", description: "Check the agreed criteria and carry out the knowledge transfer and release defined in the scope." },
    ],
    questions: [
      { question: "Do I need to replace all my tools?", answer: "Not necessarily. I can evaluate an additional module or an integration. The choice depends on the current limitations, the available access and the rule that needs to be met." },
      { question: "Do you also work on an existing system?", answer: "Yes. To define the work, I need to know the code, the infrastructure and the problem to solve. That assessment separates the requested change from any technical dependencies." },
      { question: "Can the data from spreadsheets be imported?", answer: "Importing can be part of the scope. First, the format, quality, volume and matching rules need to be checked. The validation process and who is responsible for checking are agreed in the proposal." },
      { question: "Are maintenance and support included?", answer: "What will be delivered, the documentation, the planned adjustments and any support must be stated in the proposal. Later improvements can be organized as another scope; this page does not assume any support period." },
    ],
    briefTitle: "Show me one workflow from your operation.",
    brief: ["What the team does today and where it records the information.", "Who uses the process and which difficulty needs to be solved first.", "The existing tools and any access or timeline constraints."],
  },
  {
    slug: "integracoes-e-automacoes",
    name: "Integrations and automations",
    metadataTitle: "System integrations and process automation | Eduardo Gouveia",
    metadataDescription: "Integrations between APIs, CRMs and operations tools. Workflow automation with rules, failure handling and acceptance criteria defined for each project.",
    title: "Integrations and automations to connect your operation.",
    intro: "I build integrations and automations to move information between systems, organize customer service steps and run defined routines. Before automating, we need to agree on the trigger, the rule, the destination and what happens when something fails.",
    indexDescription: "To take a manual handoff out of the way: receive a piece of information, apply a rule and record it in the right system.",
    caseId: "mudapaisagens",
    fitTitle: "When the problem is the handoff from one tool to another.",
    fit: [
      "A form or service channel receives data, but someone has to enter each record into the CRM.",
      "The team checks different systems to find out whether a step was completed.",
      "An already automated flow needs to handle failures, duplicates or new business rules.",
    ],
    decisionTitle: "Automate the rule without hiding the exceptions.",
    decision: "A flow must also work when the input is incomplete or a service is unavailable. During alignment, we define which situations can proceed automatically and which should stop for human review. AI can take part when the task requires interpretation; deterministic rules still make sense for validations and records.",
    scopeTitle: "A flow can be described from end to end.",
    scopeExamples: [
      {
        title: "Input and validation",
        description: "Receive an event from a tool and check the fields required for the next step.",
        acceptance: "Complete inputs move through the flow; records missing required fields get the agreed routing.",
      },
      {
        title: "Record at the destination",
        description: "Map the source fields to the fields of a CRM, database or other application.",
        acceptance: "A test event creates or updates the correct record. The same event repeated does not create an improper duplicate.",
      },
      {
        title: "Failure and retry",
        description: "Agree on how the operation identifies a failed attempt and when it can be retried.",
        acceptance: "A simulated failure is recorded; the agreed handling allows processing to resume without losing its state.",
      },
      {
        title: "Handoff to a person",
        description: "In customer service or AI interpretation flows, define the points where the team takes over.",
        acceptance: "The selected handoff scenario gives the team the agreed context and stops the planned automatic actions.",
      },
    ],
    process: [
      { title: "Design the flow", description: "Describe the initial event, the data that moves, the rules and the expected result in each tool." },
      { title: "Check access", description: "Validate APIs, permissions, documentation and available environments, as well as the limits of the services involved." },
      { title: "Implement and test", description: "Check the expected path and the agreed exceptions, such as a duplicate event or an unavailable destination." },
      { title: "Prepare the operation", description: "Document how to monitor the flow, identify a failure and carry out the planned maintenance actions." },
    ],
    questions: [
      { question: "Can every tool be integrated?", answer: "Feasibility depends on the access each product offers: API, exports, events or other authorized means. I need to check those options before confirming the scope. A tool without adequate access may require another solution." },
      { question: "Do you use Make, n8n or code?", answer: "The choice depends on the flow, the available integrations and the expected maintenance. The Muda Paisagens case uses Make with Pipefy. A project can use an integration platform, code or a combination of both, as needed." },
      { question: "Does the automation need artificial intelligence?", answer: "No. When the rules are clear, a conventional integration can solve it. AI is considered when there is an interpretation, classification or customer service task that justifies it and can be evaluated with examples." },
      { question: "How are service accounts and costs handled?", answer: "The accounts, permissions and services required are identified when the scope is defined. Provider charges and external dependencies should be separated from development in the proposal. The amounts depend on the tools and usage." },
    ],
    briefTitle: "Which information still has to be passed on by hand?",
    brief: ["The source and destination tools.", "An example of the event and the data that needs to move.", "What should happen when there is an error and who follows the routine."],
  },
  {
    slug: "desenvolvimento-saas",
    name: "SaaS development",
    metadataTitle: "Custom SaaS and MVP development | Eduardo Gouveia",
    metadataDescription: "SaaS platform and MVP development focused on the product’s core flow. Scope, access, data and acceptance criteria defined with Eduardo Gouveia.",
    title: "SaaS development, from the first version to the next ones.",
    intro: "I build SaaS platforms and also evolve existing products. For a first version, I start with the user, the problem the product solves and the flow that has to work for them to use it.",
    indexDescription: "To build or evolve a product used by customers, with a core flow and clear limits for each stage.",
    caseId: "clinafy",
    fitTitle: "When the goal is a product, not just a screen.",
    fit: [
      "You have a product idea and need to turn the core flow into a usable application.",
      "There is a prototype or initial system, but it lacks access rules, consistency or integrations for the next use.",
      "The product is already running and needs to evolve a module without treating every request as a rebuild.",
    ],
    decisionTitle: "The MVP doesn’t need to launch with every module.",
    decision: "Authentication, billing and separation between companies are scope decisions, not a mandatory list for every idea. First we define who uses it, which task they complete and what makes a delivery done. Market validation remains a business question; shipping software does not prove demand.",
    scopeTitle: "The first version has one job and a definition of done.",
    scopeExamples: [
      {
        title: "Core user flow",
        description: "Build the task that represents the product’s central value, from the first step to completion.",
        acceptance: "A test user completes the task with the defined inputs and rules, including one expected error scenario.",
      },
      {
        title: "Accounts and permissions",
        description: "Define the user roles and, if needed, how each organization accesses its data.",
        acceptance: "Each role accesses only what was authorized. If there are separate organizations, isolation is verified in the agreed scenarios.",
      },
      {
        title: "Billing and integrations",
        description: "When it is part of the version, connect the product to the provider and represent the states that matter for access.",
        acceptance: "The agreed events, such as confirmation and cancellation in a test environment, produce the expected states in the product.",
      },
      {
        title: "Release and continuity",
        description: "Define the environments, access and materials needed to put the version live and continue the work.",
        acceptance: "The version is checked in the planned environment, with the access and documentation specified in the proposal.",
      },
    ],
    process: [
      { title: "Cut the first version", description: "Choose the initial user, the main task and what is explicitly left out of this stage." },
      { title: "Define data and journeys", description: "Agree on the screens, roles, rules and integrations that support that flow, including the client’s dependencies." },
      { title: "Build and validate", description: "Organize deliveries to check behavior against the agreed criteria and adjust what was contracted." },
      { title: "Release the stage", description: "Prepare the environment and the knowledge transfer according to the scope. New features get their own delivery definition." },
    ],
    questions: [
      { question: "Do I need a validated idea?", answer: "You need to be able to explain the problem and who you intend to serve. I can help structure the technical scope, but building the product does not replace commercial validation or guarantee sales." },
      { question: "Does every SaaS need to be multi-tenant?", answer: "Not necessarily. We need to understand who buys, who uses and which data must be separated. The architecture follows that need and the product’s stage, instead of adding complexity by default." },
      { question: "Can there be a phase without integrated payments?", answer: "Yes, if that makes sense for how the first version is used. Billing can come in when the flow needs it. What is left out must be clear so it doesn’t become an implicit expectation." },
      { question: "Can you continue a product built by another developer?", answer: "I can evaluate it. The first step is getting to know the code, the access, the documentation and the dependencies. With that, I can define what can be reused and which changes the next scope requires." },
    ],
    briefTitle: "What does your first user need to be able to do?",
    brief: ["Who will use it and which task they need to complete.", "What already exists: an idea, a prototype, code or a product in operation.", "The essential features for the first stage and the known constraints."],
  },
];

export function getServices(locale: Locale): ServicePage[] {
  return locale === "en" ? servicesEN : services;
}

export function getServiceCases(locale: Locale): Record<string, ServiceCase> {
  return locale === "en" ? serviceCasesEN : serviceCases;
}

export function findServiceFor(slug: string, locale: Locale): ServicePage | undefined {
  return getServices(locale).find((service) => service.slug === slug);
}
