"use client";

import { useEffect, useMemo, useState, type ComponentProps } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileSearch,
  GitBranch,
  Lightbulb,
  MessageSquare,
  RefreshCcw,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type Lesson = {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  summary: string;
  bullets: string[];
  example: string;
  tip: string;
  memory: string;
  diagram?: string[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number[];
  explanation: string;
  topic: string;
  multi?: boolean;
};

export const lessons: Lesson[] = [
  {
    id: "artificial-intelligence",
    title: "Introduction to Artificial Intelligence",
    category: "AI foundations",
    icon: BrainCircuit,
    summary: "Artificial intelligence is the broad field of creating computer systems that perform tasks that usually require human intelligence.",
    bullets: ["Understanding language", "Recognizing images", "Making decisions and solving problems", "Generating content, recommendations, and fraud alerts"],
    example: "An e-commerce platform uses AI to recommend products, answer customer questions, detect suspicious transactions, and forecast demand.",
    tip: "AI is the broad field. Machine learning is one way of building AI systems.",
    memory: "AI is the umbrella; ML, deep learning, and generative AI fit inside it.",
    diagram: ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Generative AI"],
  },
  {
    id: "machine-learning",
    title: "Machine Learning Fundamentals",
    category: "AI foundations",
    icon: BrainCircuit,
    summary: "Machine learning learns patterns from historical data instead of requiring developers to program every possible rule.",
    bullets: ["Training data teaches a model", "Training adjusts the model to recognize patterns", "Inference uses the trained model on new data", "Evaluation measures how well predictions perform"],
    example: "A fraud model learns from past transactions labeled legitimate or fraudulent, then scores new transactions.",
    tip: "Historical data, model training, and predictions indicate machine learning.",
    memory: "ML = learn patterns from data and make predictions.",
    diagram: ["Historical Data", "Model Training", "Machine Learning Model", "Predictions on New Data"],
  },
  {
    id: "classical-vs-ml",
    title: "Classical Programming vs Machine Learning",
    category: "AI foundations",
    icon: GitBranch,
    summary: "Classical programming gives the computer explicit rules. Machine learning discovers useful rules from examples and known outcomes.",
    bullets: ["Classical: input data plus programmed rules produces output", "ML: historical data plus known outcomes produces a trained model", "Classical logic is best for deterministic rules", "ML is useful when every rule is difficult to write manually"],
    example: "A discount rule such as `if age >= 60, discount = 20` is classical programming. Learning suspicious transaction patterns is machine learning.",
    tip: "Explicit rules indicate classical programming; learned patterns and historical data indicate ML.",
    memory: "Program the rules versus train the pattern.",
    diagram: ["Input Data + Programmed Rules", "Output", "Historical Data + Known Outcomes", "Training → Model → Prediction"],
  },
  {
    id: "deep-learning",
    title: "Deep Learning and Neural Networks",
    category: "AI foundations",
    icon: NetworkIcon,
    summary: "Deep learning is machine learning using neural networks with multiple hidden layers that learn increasingly complex patterns.",
    bullets: ["Input layer receives features", "Hidden layers transform signals using learned weights", "Output layer produces a classification or prediction", "More hidden layers make the network deeper"],
    example: "An image model can learn edges in early layers, shapes in middle layers, and objects in later layers.",
    tip: "Deep learning is a subset of machine learning and is common in image, speech, language, and generative AI.",
    memory: "More hidden layers = deeper neural network.",
    diagram: ["Input Layer", "Hidden Layer 1", "Hidden Layer 2", "Hidden Layer 3", "Output Layer"],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    category: "Generative AI",
    icon: Sparkles,
    summary: "Generative AI creates new content rather than only classifying or predicting an existing outcome.",
    bullets: ["Generates text, images, code, audio, music, video, and summaries", "Uses a prompt or other input to guide generation", "Can create conversations and explanations", "Traditional ML predicts; generative AI creates"],
    example: "A fraud system predicts risk with traditional ML, while generative AI writes a readable fraud report summary for an investigator.",
    tip: "Creating text, images, code, or audio indicates generative AI.",
    memory: "Generative AI generates new content.",
    diagram: ["User Prompt", "Foundation Model", "Generated Content"],
  },
  {
    id: "foundation-models",
    title: "Foundation Models and Large Language Models",
    category: "Generative AI",
    icon: Sparkles,
    summary: "Foundation models are large, pre-trained models adaptable to many tasks. Large language models are foundation models focused primarily on language.",
    bullets: ["Pre-trained on vast collections of data", "Reusable across question answering, summarization, translation, and coding", "May work with text, images, code, audio, or video", "LLMs understand and generate human-like language"],
    example: "The same foundation model can power a chat assistant, document summarizer, translator, and code helper after suitable adaptation.",
    tip: "Foundation model means pre-trained and multi-purpose; LLM means language-focused foundation model.",
    memory: "Foundation model = one trained foundation for many tasks.",
    diagram: ["Massive Training Data", "Foundation Model", "Chat • Summary • Code • Images"],
  },
  {
    id: "aws-ai-overview",
    title: "AWS AI Services Overview",
    category: "AWS AI services",
    icon: Sparkles,
    summary: "AWS offers three useful levels: pre-built AI services, SageMaker AI for custom ML, and frameworks plus infrastructure for maximum control.",
    bullets: ["Pre-built AI services add ready-made capabilities without building models", "Amazon SageMaker AI builds, trains, deploys, and monitors custom models", "Frameworks and infrastructure provide deep configuration control", "Choose the highest-level managed service that fits the requirement"],
    example: "A team can use Rekognition for image labels, SageMaker AI for a custom risk model, or PyTorch on EC2 for full control.",
    tip: "Ready-made capability → AI service; custom ML lifecycle → SageMaker AI; maximum control → frameworks and infrastructure.",
    memory: "Use, build, or control: AI services, SageMaker, frameworks.",
  },
  {
    id: "language-ai",
    title: "AWS Language AI Services",
    category: "AWS AI services",
    icon: MessageSquare,
    summary: "Amazon Comprehend, Polly, Transcribe, and Translate provide managed language capabilities.",
    bullets: ["Comprehend: sentiment, entities, key phrases, language, and topics", "Polly: text to natural-sounding speech", "Transcribe: speech to text", "Translate: text between languages"],
    example: "A contact center transcribes calls, detects sentiment, translates a message, and uses Polly to read a response aloud.",
    tip: "Comprehend understands text; Polly speaks text; Transcribe hears speech; Translate changes language.",
    memory: "Polly talks, Transcribe types, Translate changes language, Comprehend understands.",
  },
  {
    id: "vision-search-documents",
    title: "AWS Vision, Search, and Document AI Services",
    category: "AWS AI services",
    icon: FileSearch,
    summary: "AWS managed AI services can recognize visual content, extract document data, and search enterprise knowledge.",
    bullets: ["Rekognition analyzes images and videos for objects, scenes, faces, and moderation", "Textract extracts printed text, handwriting, tables, and forms", "Kendra provides intelligent enterprise search across company information", "Use the specialized service instead of building the capability from scratch"],
    example: "An insurer uses Textract for claims forms, Rekognition for damage photos, and Kendra for policy search.",
    tip: "Images/video → Rekognition; forms/tables → Textract; company knowledge search → Kendra.",
    memory: "Recognize, extract, search: Rekognition, Textract, Kendra.",
  },
  {
    id: "conversational-recommendations",
    title: "Conversational AI and Recommendations",
    category: "AWS AI services",
    icon: MessageSquare,
    summary: "Amazon Lex builds chatbots and voice assistants, while Amazon Personalize creates individualized recommendations.",
    bullets: ["Lex supports natural language understanding, intents, slots, chat, and voice", "Personalize learns from user activity to rank relevant products or content", "Both are managed, pre-built AI services", "Choose based on the desired outcome: conversation or recommendation"],
    example: "A retail app uses Lex for order-support conversations and Personalize for product suggestions.",
    tip: "Chatbot → Lex; personalized products, movies, music, or articles → Personalize.",
    memory: "Lex talks; Personalize recommends.",
  },
  {
    id: "sagemaker-ai",
    title: "Amazon SageMaker AI",
    category: "Custom machine learning",
    icon: Workflow,
    summary: "Amazon SageMaker AI is a fully managed service for building, training, tuning, deploying, and monitoring custom ML models.",
    bullets: ["Works across the ML lifecycle", "Provides scalable training and managed deployment", "Supports repeatable workflows and monitoring", "Reduces infrastructure operations for ML teams"],
    example: "A bank builds and deploys a custom fraud model, then monitors its predictions using SageMaker AI.",
    tip: "Build, train, and deploy a custom ML model without managing all infrastructure → SageMaker AI.",
    memory: "SageMaker AI = build, train, deploy, monitor.",
    diagram: ["Training Data", "Build", "Train", "Evaluate", "Deploy", "Predictions"],
  },
  {
    id: "ml-frameworks",
    title: "ML Frameworks and Infrastructure",
    category: "Custom machine learning",
    icon: Database,
    summary: "Frameworks such as TensorFlow, PyTorch, and Apache MXNet provide libraries and algorithms; AWS compute supplies the infrastructure.",
    bullets: ["EC2 provides configurable compute instances", "EMR supports large-scale data processing", "ECS runs containerized ML workloads", "This approach provides flexibility but requires more operational management"],
    example: "An experienced ML team runs a specific PyTorch training configuration on GPU-backed EC2 instances.",
    tip: "Frameworks on AWS infrastructure are appropriate when maximum control and customization outweigh management effort.",
    memory: "More control means more responsibility.",
  },
  {
    id: "bedrock-jumpstart",
    title: "Amazon Bedrock and SageMaker JumpStart",
    category: "Generative AI",
    icon: Sparkles,
    summary: "Amazon Bedrock provides managed access to foundation models through a single API. SageMaker JumpStart is an ML hub for discovering and deploying models.",
    bullets: ["Bedrock builds generative AI applications without managing model infrastructure", "Bedrock supports model choice and AWS security integration", "JumpStart provides foundation models, pre-trained models, algorithms, and example solutions", "JumpStart is closely connected to SageMaker ML workflows"],
    example: "A product team uses Bedrock to create a managed question-answering assistant; an ML team uses JumpStart to experiment with and deploy a pre-trained model.",
    tip: "Managed GenAI application with foundation models → Bedrock; model hub and ML experimentation → JumpStart.",
    memory: "Bedrock = one API for many models; JumpStart = discover and deploy models.",
  },
  {
    id: "amazon-q",
    title: "Amazon Q Business and Amazon Q Developer",
    category: "Generative AI",
    icon: MessageSquare,
    summary: "Amazon Q Business is an employee assistant using company knowledge. Amazon Q Developer is an AI assistant for software development.",
    bullets: ["Q Business answers questions and summarizes internal information", "Q Business can assist with enterprise tasks and connected applications", "Q Developer generates and explains code, debugs, tests, reviews, and assists with AWS development", "Both are purpose-built assistants rather than general infrastructure services"],
    example: "Employees ask Q Business about HR policy; developers ask Q Developer to explain a stack trace or suggest a unit test.",
    tip: "Company knowledge assistant → Q Business; coding help → Q Developer.",
    memory: "Q Business serves the business; Q Developer serves developers.",
  },
  {
    id: "analytics-fundamentals",
    title: "Data Analytics Fundamentals",
    category: "Data analytics",
    icon: BarChart3,
    summary: "Data analytics examines data to discover trends, relationships, insights, opportunities, and operational problems.",
    bullets: ["Structured data: relational tables and spreadsheets", "Semi-structured data: JSON, XML, and logs", "Unstructured data: images, video, audio, and documents", "Analytics explains what happened; ML often predicts what may happen"],
    example: "A retailer analyzes sales trends and customer behavior to decide which products to stock next season.",
    tip: "Reports and dashboards often indicate analytics; trained models and predictions indicate ML.",
    memory: "Analytics finds insight; ML learns patterns for prediction.",
  },
  {
    id: "etl-pipelines",
    title: "ETL and Data Pipelines",
    category: "Data pipelines",
    icon: Workflow,
    summary: "ETL means Extract, Transform, Load. A data pipeline automates this movement and preparation so it is repeatable and scalable.",
    bullets: ["Extract from databases, applications, files, APIs, IoT devices, and logs", "Transform by cleaning, validating, filtering, joining, and standardizing", "Load into data lakes, warehouses, analytics platforms, or ML systems", "Pipelines reduce manual work and improve consistency"],
    example: "A pipeline extracts sales records, removes duplicates, standardizes currencies, and loads analytics-ready data.",
    tip: "ETL and repeatable data preparation indicate a data pipeline or AWS Glue.",
    memory: "ETL = Extract, Transform, Load.",
    diagram: ["Data Sources", "Extract", "Transform", "Load", "Analytics and AI"],
  },
  {
    id: "data-ingestion",
    title: "AWS Data Ingestion Services",
    category: "Data pipelines",
    icon: Activity,
    summary: "Data ingestion moves data from source systems into storage or analytics destinations, either in real time, near real time, or in batches.",
    bullets: ["Kinesis Data Streams supports real-time streams and custom consumers", "Amazon Data Firehose provides fully managed near-real-time delivery", "Streams fit clickstreams, IoT, financial events, sensors, and application events", "Firehose delivers data to destinations such as S3, Redshift, and OpenSearch"],
    example: "A fraud system processes live transaction events with Kinesis Data Streams while Firehose delivers a copy to S3 for later analysis.",
    tip: "Immediate custom stream processing → Kinesis Data Streams; managed delivery within seconds → Data Firehose.",
    memory: "Streams process live data; Firehose delivers it.",
  },
  {
    id: "storage-cataloging",
    title: "AWS Data Storage and Cataloging Services",
    category: "Data pipelines",
    icon: Database,
    summary: "Amazon S3 is a common data lake for raw data, Redshift is a data warehouse for structured analytics, and Glue Data Catalog stores metadata.",
    bullets: ["S3 stores structured, semi-structured, and unstructured objects at scale", "Redshift provides columnar, massively parallel SQL analytics", "Metadata describes location, schema, columns, format, and partitions", "Glue Data Catalog is a centralized managed metadata repository"],
    example: "Raw JSON and Parquet files land in S3, then the catalog records their schemas so analytics tools can find them.",
    tip: "Data lake → S3; data warehouse → Redshift; data about data → Glue Data Catalog.",
    memory: "S3 stores it, Redshift analyzes it, Glue Catalog describes it.",
  },
  {
    id: "data-processing",
    title: "AWS Data Processing Services",
    category: "Data pipelines",
    icon: Workflow,
    summary: "AWS Glue is a managed ETL service, while Amazon EMR is a managed big-data platform for frameworks such as Spark, Hadoop, and Hive.",
    bullets: ["Glue discovers, transforms, and loads data", "Glue uses Data Catalog metadata", "EMR provisions and manages clusters for large-scale processing", "Choose EMR for framework-based big-data workloads and teams needing that ecosystem"],
    example: "Glue converts raw S3 logs into clean tables; EMR runs a large Spark job over billions of records.",
    tip: "Managed ETL → Glue; Spark, Hadoop, or large cluster processing → EMR.",
    memory: "Glue cleans; EMR processes big data with frameworks.",
  },
  {
    id: "analysis-visualization",
    title: "AWS Analysis and Visualization Services",
    category: "Data analytics",
    icon: BarChart3,
    summary: "Athena queries S3 with serverless SQL, Redshift handles frequent high-performance analytics, QuickSight builds BI dashboards, and OpenSearch supports search and operational analytics.",
    bullets: ["Athena: ad hoc SQL queries without servers", "Redshift: frequent, complex warehouse analytics", "QuickSight: dashboards, reports, charts, and KPIs", "OpenSearch: keyword search, logs, metrics, traces, and real-time operational dashboards"],
    example: "An operations team queries logs with Athena, analyzes warehouse data in Redshift, and shares KPIs in QuickSight.",
    tip: "SQL on S3 → Athena; dashboards → QuickSight; logs and operational search → OpenSearch.",
    memory: "Athena queries, Redshift warehouses, QuickSight visualizes, OpenSearch searches.",
  },
  {
    id: "complete-data-pipeline",
    title: "Complete AWS Data Pipeline",
    category: "Data pipelines",
    icon: GitBranch,
    summary: "A complete pipeline connects ingestion, storage, cataloging, processing, analysis, and visualization.",
    bullets: ["Ingest: Kinesis Data Streams or Data Firehose", "Store: S3 data lake or Redshift warehouse", "Catalog: Glue Data Catalog", "Process: Glue or EMR", "Analyze and visualize: Athena, Redshift, QuickSight, or OpenSearch"],
    example: "A financial organization streams stock transactions into Kinesis, stores raw records in S3, catalogs them with Glue, transforms them, loads Redshift, and creates QuickSight dashboards.",
    tip: "Follow the data: source → ingest → store → catalog → process → analyze → visualize.",
    memory: "Move it, store it, describe it, clean it, query it, show it.",
    diagram: ["Applications • Databases • IoT • Logs", "Kinesis / Firehose", "S3 / Redshift", "Glue Data Catalog", "Glue / EMR", "Athena / Redshift / QuickSight / OpenSearch"],
  },
  {
    id: "service-comparison",
    title: "Service Comparison and Exam Review",
    category: "Exam review",
    icon: Search,
    summary: "Use the service keyword that best matches the requirement. Managed, purpose-built services are common Cloud Practitioner answers.",
    bullets: ["Text to speech → Polly; speech to text → Transcribe", "Sentiment → Comprehend; recommendations → Personalize", "Custom ML → SageMaker AI; GenAI apps → Bedrock", "Real-time ingestion → Kinesis; near-real-time delivery → Firehose", "Data lake → S3; warehouse → Redshift; ETL → Glue"],
    example: "When a question asks for a business dashboard, select QuickSight. When it asks for metadata, select Glue Data Catalog.",
    tip: "Identify the verb and the data: recognize, extract, search, recommend, train, stream, catalog, transform, query, or visualize.",
    memory: "Match the exam keyword to the purpose-built service.",
  },
];

function NetworkIcon(props: ComponentProps<typeof BrainCircuit>) {
  return <GitBranch {...props} />;
}

export const quizQuestions: QuizQuestion[] = [
  { id: "q1", question: "What is the main difference between classical programming and machine learning?", options: ["Classical programming is only for math, while ML is only for images", "Classical programming is for simple tasks, while ML is for complex tasks", "Classical programming needs more compute than ML", "Classical programming uses explicit rules; ML learns patterns from historical data"], answer: [3], explanation: "Classical programming relies on developer-written rules. Machine learning trains a model from historical data and uses learned patterns for predictions.", topic: "AI foundations" },
  { id: "q2", question: "Which are characteristics of foundation models? Select two.", options: ["Pre-trained on vast collections of data", "Adaptable to multiple tasks", "Trained for only one task", "Programmed only with explicit rules", "Used only to create images"], answer: [0, 1], explanation: "Foundation models are pre-trained on very large datasets and can be adapted to many tasks, including generation, summarization, translation, and coding.", topic: "Generative AI", multi: true },
  { id: "q3", question: "What does Amazon Bedrock provide for accessing foundation models?", options: ["Free unlimited use", "A single API", "Dedicated cloud storage", "An open-source repository"], answer: [1], explanation: "Amazon Bedrock provides a managed service and a single API for using foundation models from Amazon and leading AI companies.", topic: "Bedrock" },
  { id: "q4", question: "Which pre-built AWS AI service provides individualized product recommendations?", options: ["Amazon Comprehend", "Amazon Personalize", "Amazon Textract", "Amazon Kendra"], answer: [1], explanation: "Amazon Personalize creates recommendations and personalized rankings from user activity and preferences.", topic: "AI services" },
  { id: "q5", question: "Which AWS service converts text into natural-sounding speech?", options: ["Amazon Transcribe", "Amazon Translate", "Amazon Polly", "Amazon Comprehend"], answer: [2], explanation: "Amazon Polly is text-to-speech. Transcribe performs the reverse direction: speech-to-text.", topic: "AI services" },
  { id: "q6", question: "Which service converts recorded speech into text?", options: ["Amazon Polly", "Amazon Transcribe", "Amazon Lex", "Amazon Rekognition"], answer: [1], explanation: "Amazon Transcribe uses speech recognition to produce text from audio.", topic: "AI services" },
  { id: "q7", question: "A company wants sentiment analysis on customer reviews. Which service should it choose?", options: ["Amazon Comprehend", "Amazon Translate", "Amazon Textract", "Amazon Neptune"], answer: [0], explanation: "Amazon Comprehend analyzes text for sentiment, entities, key phrases, language, and topics.", topic: "AI services" },
  { id: "q8", question: "Which service extracts text, tables, and forms from scanned documents?", options: ["Amazon Rekognition", "Amazon Textract", "Amazon Kendra", "Amazon Athena"], answer: [1], explanation: "Amazon Textract extracts printed text, handwriting, tables, and form data from documents.", topic: "AI services" },
  { id: "q9", question: "Which service analyzes objects and scenes in images and videos?", options: ["Amazon Rekognition", "Amazon Comprehend", "Amazon Personalize", "Amazon Redshift"], answer: [0], explanation: "Amazon Rekognition provides managed image and video analysis, including object and scene detection.", topic: "AI services" },
  { id: "q10", question: "Which AWS service provides intelligent search across internal company documents?", options: ["Amazon Kendra", "Amazon Lex", "Amazon Polly", "Amazon EMR"], answer: [0], explanation: "Amazon Kendra is an intelligent enterprise search service for company knowledge and documents.", topic: "AI services" },
  { id: "q11", question: "Which service is used to build chatbots and voice assistants?", options: ["Amazon Lex", "Amazon Personalize", "Amazon Bedrock only", "AWS Glue"], answer: [0], explanation: "Amazon Lex provides conversational interfaces with natural language understanding, intents, and slots.", topic: "AI services" },
  { id: "q12", question: "A team needs to build, train, deploy, and monitor a custom ML model. Which service fits best?", options: ["Amazon SageMaker AI", "Amazon QuickSight", "Amazon Kendra", "Amazon Data Firehose"], answer: [0], explanation: "SageMaker AI supports the managed ML lifecycle from model development through deployment and monitoring.", topic: "SageMaker AI" },
  { id: "q13", question: "Which are common machine learning framework or infrastructure options? Select two.", options: ["PyTorch", "TensorFlow", "Amazon QuickSight", "Amazon Polly", "AWS Glue Data Catalog"], answer: [0, 1], explanation: "PyTorch and TensorFlow are ML frameworks. QuickSight, Polly, and Glue Data Catalog serve analytics or managed AI/data roles.", topic: "ML infrastructure", multi: true },
  { id: "q14", question: "What is the best description of SageMaker JumpStart?", options: ["A DNS service", "An ML hub for pre-trained models, algorithms, and example solutions", "A data warehouse", "A speech-to-text service"], answer: [1], explanation: "JumpStart helps ML teams discover, experiment with, customize, and deploy models inside SageMaker workflows.", topic: "Generative AI" },
  { id: "q15", question: "Which service is designed as an AI assistant for employees using company knowledge?", options: ["Amazon Q Business", "Amazon Q Developer", "Amazon Neptune", "Amazon Athena"], answer: [0], explanation: "Amazon Q Business answers questions, summarizes internal information, and assists employees with business tasks.", topic: "Amazon Q" },
  { id: "q16", question: "Which service assists developers with code generation, debugging, tests, and AWS development?", options: ["Amazon Q Business", "Amazon Q Developer", "Amazon Kendra", "Amazon Redshift"], answer: [1], explanation: "Amazon Q Developer is the development-focused generative AI assistant.", topic: "Amazon Q" },
  { id: "q17", question: "Which data types are common in analytics? Select three.", options: ["Structured tables", "Semi-structured JSON", "Unstructured images and video", "Only relational rows", "Only numerical data"], answer: [0, 1, 2], explanation: "Analytics can use structured, semi-structured, and unstructured data.", topic: "Data analytics", multi: true },
  { id: "q18", question: "What does ETL stand for?", options: ["Evaluate, Train, Launch", "Extract, Transform, Load", "Encrypt, Transfer, Link", "Event, Trigger, Log"], answer: [1], explanation: "ETL extracts data from sources, transforms it into a useful format, and loads it into a destination.", topic: "Data pipelines" },
  { id: "q19", question: "Which service is best for real-time streaming ingestion with custom stream consumers?", options: ["Amazon Kinesis Data Streams", "Amazon Data Firehose", "Amazon QuickSight", "AWS Glue Data Catalog"], answer: [0], explanation: "Kinesis Data Streams supports real-time streams and custom applications that consume and process records.", topic: "Ingestion" },
  { id: "q20", question: "Which service provides fully managed near-real-time delivery to destinations such as S3, Redshift, and OpenSearch?", options: ["Amazon Data Firehose", "Amazon EMR", "Amazon Athena", "Amazon Comprehend"], answer: [0], explanation: "Data Firehose automatically provisions, scales, and delivers streaming data within seconds.", topic: "Ingestion" },
  { id: "q21", question: "Which AWS service is a common data lake for raw structured, semi-structured, and unstructured data?", options: ["Amazon S3", "Amazon Redshift", "Amazon QuickSight", "Amazon Kendra"], answer: [0], explanation: "Amazon S3 provides scalable object storage and is commonly used as a data lake.", topic: "Storage" },
  { id: "q22", question: "Which service is a managed data warehouse optimized for SQL analytics?", options: ["Amazon Redshift", "Amazon S3", "Amazon EFS", "Amazon Polly"], answer: [0], explanation: "Amazon Redshift is a managed data warehouse for high-performance structured and semi-structured analytics.", topic: "Storage" },
  { id: "q23", question: "What does AWS Glue Data Catalog store?", options: ["Metadata such as schemas, locations, columns, formats, and partitions", "Audio recordings", "Only machine learning weights", "Employee chat messages"], answer: [0], explanation: "The Glue Data Catalog is a centralized metadata repository that helps services discover and understand datasets.", topic: "Cataloging" },
  { id: "q24", question: "Which service is a managed ETL service that can discover, transform, and load data?", options: ["AWS Glue", "Amazon EMR", "Amazon Athena", "Amazon Personalize"], answer: [0], explanation: "AWS Glue provides managed ETL workflows and integrates with the Glue Data Catalog.", topic: "Processing" },
  { id: "q25", question: "Which are correct AWS analytics service matches? Select three.", options: ["Amazon Athena → serverless SQL queries on S3", "Amazon QuickSight → dashboards and BI visualization", "Amazon OpenSearch → search, logs, and operational dashboards", "Amazon Polly → data warehouse analytics", "Amazon EMR → employee coding assistant"], answer: [0, 1, 2], explanation: "Athena queries S3 with serverless SQL, QuickSight creates BI visualizations, and OpenSearch supports search and operational analytics.", topic: "Analysis", multi: true },
];

export const serviceRows = [
  ["Amazon Comprehend", "AI", "Text and sentiment analysis", "Understand text"],
  ["Amazon Polly", "AI", "Text to speech", "Text to voice"],
  ["Amazon Transcribe", "AI", "Speech to text", "Audio transcription"],
  ["Amazon Translate", "AI", "Language translation", "Translate text"],
  ["Amazon Rekognition", "AI", "Image and video analysis", "Recognize images"],
  ["Amazon Textract", "AI", "Extract text, tables, and forms", "Document extraction"],
  ["Amazon Kendra", "AI", "Enterprise intelligent search", "Company knowledge"],
  ["Amazon Lex", "AI", "Chatbots and voice assistants", "Conversational AI"],
  ["Amazon Personalize", "AI", "Recommendations", "Personalized products"],
  ["Amazon SageMaker AI", "ML", "Build, train, and deploy custom ML", "Custom model"],
  ["Amazon Bedrock", "GenAI", "Build GenAI apps with foundation models", "Single API"],
  ["SageMaker JumpStart", "ML hub", "Discover and deploy models", "Pre-trained models"],
  ["Amazon Q Business", "GenAI", "Employee business assistant", "Company knowledge"],
  ["Amazon Q Developer", "GenAI", "Developer assistant", "Coding help"],
  ["Kinesis Data Streams", "Ingestion", "Real-time streaming", "Live stream"],
  ["Amazon Data Firehose", "Ingestion", "Near-real-time delivery", "Deliver streams"],
  ["Amazon S3", "Storage", "Data lake", "Raw data"],
  ["Amazon Redshift", "Storage / analysis", "Data warehouse", "BI analytics"],
  ["Glue Data Catalog", "Catalog", "Metadata repository", "Data about data"],
  ["AWS Glue", "Processing", "ETL", "Transform data"],
  ["Amazon EMR", "Processing", "Big-data frameworks", "Spark and Hadoop"],
  ["Amazon Athena", "Analysis", "Serverless SQL", "SQL on S3"],
  ["Amazon QuickSight", "Visualization", "Dashboards and reports", "BI visualization"],
  ["Amazon OpenSearch", "Search / visualization", "Logs, metrics, and search", "Operational dashboards"],
];

function Diagram({ items }: { items: string[] }) {
  return <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-primary/15 bg-primary/5 p-5">{items.map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-2"><span className="rounded-lg border border-primary/20 bg-background/60 px-3 py-2 text-center text-xs font-semibold text-primary">{item}</span>{index < items.length - 1 ? <ArrowRight className="h-4 w-4 text-primary/60" /> : null}</span>)}</div>;
}

function LessonCard({ lesson, completed, onComplete }: { lesson: Lesson; completed: boolean; onComplete: () => void }) {
  const Icon = lesson.icon;
  return <Card id={lesson.id} className="scroll-mt-8 border-white/10 bg-card/70 backdrop-blur-xl"><CardHeader className="gap-3"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><div><Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{lesson.category}</Badge><CardTitle className="mt-2 font-headline text-2xl">{lesson.title}</CardTitle></div></div>{completed ? <CheckCircle2 className="h-6 w-6 shrink-0 text-success" /> : null}</div></CardHeader><CardContent className="space-y-5"><p className="text-sm leading-7 text-foreground/90">{lesson.summary}</p>{lesson.diagram ? <Diagram items={lesson.diagram} /> : null}<div className="grid gap-5 md:grid-cols-2"><div><h4 className="mb-2 text-sm font-semibold">Key ideas</h4><ul className="space-y-2 text-sm leading-6 text-muted-foreground">{lesson.bullets.map((bullet) => <li key={bullet} className="flex gap-2"><span className="text-primary">•</span><span>{bullet}</span></li>)}</ul></div><div className="space-y-3"><div className="rounded-lg border border-primary/15 bg-primary/5 p-4"><p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Real-world example: </span>{lesson.example}</p></div><p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-primary">Exam tip: </span>{lesson.tip}</p><p className="text-sm leading-6 text-muted-foreground"><span className="font-semibold text-primary">Memory trick: </span>{lesson.memory}</p></div></div><Button variant={completed ? "secondary" : "default"} className="rounded-full" onClick={onComplete}>{completed ? "Lesson Completed" : "Mark Lesson Complete"}<CheckCircle2 className="ml-2 h-4 w-4" /></Button></CardContent></Card>;
}

function ComparisonTable() {
  const [filter, setFilter] = useState("");
  const filtered = serviceRows.filter((row) => row.join(" ").toLowerCase().includes(filter.toLowerCase()));
  return <Card className="overflow-hidden border-white/10 bg-card/70 backdrop-blur-xl"><CardHeader><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><CardTitle className="font-headline text-2xl">Service Comparison and Exam Review</CardTitle><div className="relative w-full md:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search services" className="h-10 w-full rounded-lg border border-white/10 bg-background/60 pl-9 pr-3 text-sm outline-none focus:border-primary/50" /></div></div></CardHeader><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-primary/10"><tr>{["AWS Service", "Category", "Main Purpose", "Exam Keyword"].map((column) => <th key={column} className="px-4 py-3 font-semibold">{column}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row[0]} className="border-t border-white/10"><td className="px-4 py-3 font-semibold">{row[0]}</td><td className="px-4 py-3 text-muted-foreground">{row[1]}</td><td className="px-4 py-3 text-muted-foreground">{row[2]}</td><td className="px-4 py-3 text-primary">{row[3]}</td></tr>)}</tbody></table></CardContent></Card>;
}

function FinalQuiz({ onComplete }: { onComplete: (passed: boolean, score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const score = useMemo(() => quizQuestions.reduce((total, question) => { const selected = answers[question.id] ?? []; return total + (selected.length === question.answer.length && selected.every((choice) => question.answer.includes(choice)) ? 1 : 0); }, 0), [answers]);

  useEffect(() => { const saved = window.localStorage.getItem("aws-module-8-best-score"); if (saved) setBestScore(Number(saved)); }, []);

  const toggleAnswer = (question: QuizQuestion, optionIndex: number) => {
    if (submitted) return;
    setAnswers((current) => {
      const selected = current[question.id] ?? [];
      if (question.multi) return { ...current, [question.id]: selected.includes(optionIndex) ? selected.filter((item) => item !== optionIndex) : [...selected, optionIndex] };
      return { ...current, [question.id]: [optionIndex] };
    });
  };

  const submit = () => {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const nextBest = Math.max(bestScore ?? 0, percentage);
    window.localStorage.setItem("aws-module-8-best-score", String(nextBest));
    setBestScore(nextBest);
    setSubmitted(true);
    onComplete(percentage >= 80, percentage);
  };

  return <section id="final-quiz" className="space-y-5 scroll-mt-8"><div><Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Final practice quiz</Badge><h3 className="mt-3 font-headline text-2xl font-bold">AWS AI, ML, and Data Analytics Assessment</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{quizQuestions.length} questions · 80% recommended passing score · Select all that apply questions are labeled.</p></div>{quizQuestions.map((question, questionIndex) => { const selected = answers[question.id] ?? []; const correct = selected.length === question.answer.length && selected.every((choice) => question.answer.includes(choice)); return <Card key={question.id} className={`border-white/10 bg-card/70 ${submitted ? (correct ? "border-success/40" : "border-destructive/40") : ""}`}><CardContent className="space-y-4 p-5"><div className="flex items-start justify-between gap-3"><p className="font-semibold leading-6">{questionIndex + 1}. {question.question}</p><Badge variant="secondary" className="shrink-0">{question.topic}</Badge></div><div className="grid gap-2">{question.options.map((option, optionIndex) => { const isSelected = selected.includes(optionIndex); const isAnswer = question.answer.includes(optionIndex); return <button key={option} type="button" onClick={() => toggleAnswer(question, optionIndex)} className={`rounded-lg border p-3 text-left text-sm transition-colors ${isSelected ? "border-primary/50 bg-primary/10" : "border-white/10 bg-background/30 hover:border-primary/30"} ${submitted && isAnswer ? "border-success/50 bg-success/10" : ""}`}><span className="mr-2 font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>{option}</button>; })}</div>{submitted ? <div className={`rounded-lg border p-3 text-sm leading-6 ${correct ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"}`}><p className="font-semibold">{correct ? "Correct" : "Review this answer"}</p><p className="mt-1 text-muted-foreground">{question.explanation}</p></div> : null}</CardContent></Card>; })}<Card className="border-primary/20 bg-primary/5"><CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">{submitted ? `Score: ${score} / ${quizQuestions.length} (${Math.round((score / quizQuestions.length) * 100)}%)` : "Submit when you have answered every question."}</p>{bestScore !== null ? <p className="mt-1 text-sm text-muted-foreground">Best score: {bestScore}%</p> : null}</div><div className="flex gap-2"><Button variant="outline" className="rounded-full border-white/10" onClick={() => { setAnswers({}); setSubmitted(false); }}><RefreshCcw className="mr-2 h-4 w-4" />Retry Quiz</Button><Button className="rounded-full" onClick={submit} disabled={submitted}>{submitted ? "Submitted" : "Submit Quiz"}</Button></div></CardContent></Card></section>;
}

export function Module8AiMlDataAnalytics() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const storageKey = "aws-module-8-completed-lessons";
  const totalSteps = lessons.length + 1;
  const completedSteps = completed.length + (quizPassed ? 1 : 0);
  const progress = Math.round((completedSteps / totalSteps) * 100);

  useEffect(() => { const saved = window.localStorage.getItem(storageKey); if (saved) setCompleted(JSON.parse(saved)); const savedQuiz = window.localStorage.getItem("aws-module-8-quiz-passed"); setQuizPassed(savedQuiz === "true"); setHydrated(true); }, []);

  const markComplete = (id: string) => setCompleted((current) => { const next = current.includes(id) ? current : [...current, id]; window.localStorage.setItem(storageKey, JSON.stringify(next)); return next; });
  const goTo = (index: number) => { setActiveIndex(Math.max(0, Math.min(lessons.length - 1, index))); document.getElementById(lessons[Math.max(0, Math.min(lessons.length - 1, index))].id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <div className="space-y-8"><Card className="border-primary/20 bg-card/60 backdrop-blur-xl"><CardContent className="space-y-5 p-6"><div className="flex flex-wrap gap-2"><Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">AWS Certified Cloud Practitioner</Badge><Badge variant="secondary">Module 8</Badge><Badge variant="outline" className="border-white/10">90–120 minutes · Beginner</Badge></div><div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div><h2 className="font-headline text-3xl font-bold md:text-4xl">AI, Machine Learning, Generative AI, and Data Analytics</h2><p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">Learn AI and ML foundations, AWS pre-built AI services, SageMaker AI, Bedrock, Amazon Q, ETL, data pipelines, analytics services, and exam-ready service selection.</p></div><BrainCircuit className="hidden h-14 w-14 shrink-0 text-primary md:block" /></div><div className="space-y-2"><div className="flex justify-between text-sm"><span className="font-semibold">Module progress</span><span className="text-muted-foreground">{hydrated ? `${progress}%` : "Loading"}</span></div><Progress value={hydrated ? progress : 0} className="h-2" /><p className="text-xs text-muted-foreground">{completedSteps} of {totalSteps} required steps completed</p></div></CardContent></Card>
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,820px)] lg:justify-center"><aside className="lg:self-start"><Card className="border-white/10 bg-card/80 backdrop-blur-xl"><CardHeader><CardTitle className="text-lg">Module 8 Lessons</CardTitle></CardHeader><CardContent className="space-y-2">{lessons.map((lesson, index) => { const Icon = lesson.icon; const done = completed.includes(lesson.id); return <button key={lesson.id} type="button" onClick={() => goTo(index)} className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm leading-5 transition-colors ${activeIndex === index ? "border-primary/40 bg-primary/10 text-primary" : "border-white/10 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-primary"}`}><span className="mt-0.5 text-xs font-semibold">{done ? <CheckCircle2 className="h-4 w-4 text-success" /> : index + 1}</span><Icon className="mt-0.5 h-4 w-4 shrink-0" /><span>{lesson.title}</span></button>; })}<button type="button" onClick={() => document.getElementById("final-quiz")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex w-full items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-left text-sm font-semibold text-primary"><span className="mt-0.5 text-xs">{quizPassed ? <CheckCircle2 className="h-4 w-4 text-success" /> : "24"}</span><Sparkles className="mt-0.5 h-4 w-4 shrink-0" /><span>Final Practice Quiz</span></button></CardContent></Card></aside><div className="w-full max-w-[820px] space-y-10">{lessons.map((lesson, index) => <div key={lesson.id} onFocus={() => setActiveIndex(index)}><LessonCard lesson={lesson} completed={completed.includes(lesson.id)} onComplete={() => markComplete(lesson.id)} /><div className="mt-3 flex justify-between gap-3"><Button variant="outline" className="rounded-full border-white/10" disabled={index === 0} onClick={() => goTo(index - 1)}><ArrowLeft className="mr-2 h-4 w-4" />Previous Lesson</Button><Button variant="outline" className="rounded-full border-white/10" disabled={index === lessons.length - 1} onClick={() => goTo(index + 1)}>Next Lesson<ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>)}<ComparisonTable /><Card className="border-success/20 bg-success/10"><CardContent className="space-y-4 p-6"><div className="flex items-center gap-2 text-success"><Lightbulb className="h-5 w-5" /><h3 className="font-headline text-2xl font-bold">Quick Exam Shortcuts</h3></div><div className="grid gap-3 md:grid-cols-2">{["Text to speech → Amazon Polly", "Speech to text → Amazon Transcribe", "Sentiment analysis → Amazon Comprehend", "Document extraction → Amazon Textract", "Custom ML model → Amazon SageMaker AI", "GenAI app with foundation models → Amazon Bedrock", "Employee assistant → Amazon Q Business", "Developer coding assistant → Amazon Q Developer", "Real-time ingestion → Kinesis Data Streams", "Near-real-time delivery → Amazon Data Firehose", "Data lake → Amazon S3", "ETL → AWS Glue", "SQL on S3 → Amazon Athena", "Dashboards → Amazon QuickSight"].map((item) => <div key={item} className="rounded-lg border border-white/10 bg-background/40 p-3 text-sm text-muted-foreground">{item}</div>)}</div></CardContent></Card><FinalQuiz onComplete={(passed) => { setQuizPassed(passed); window.localStorage.setItem("aws-module-8-quiz-passed", String(passed)); }} />{progress === 100 ? <Card className="border-success/30 bg-success/10"><CardContent className="flex items-center gap-3 p-5 text-success"><CheckCircle2 className="h-6 w-6" /><p className="font-semibold">Module 8 complete. You finished every lesson and passed the final quiz.</p></CardContent></Card> : null}</div></div></div>;
}
