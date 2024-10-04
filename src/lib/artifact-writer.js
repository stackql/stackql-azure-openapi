import { writeBinary, writeString } from "@azure-tools/uri";

/**
 * ArtifactWriterStats
 * Number of writes that have been requested and completed.
 */
export class ArtifactWriter {
  constructor(config) {
    this.config = config;
    this.stats = {
      writeRequested: 0,
      writeCompleted: 0,
    };
    this.tasks = [];
  }

  /**
   * Write an artifact (binary or string) to the specified URI.
   * @param {Object} artifact - The artifact object containing uri, type, and content.
   */
  writeArtifact(artifact) {
    this.stats.writeRequested++;

    const action = async () => {
      if (artifact.type === "binary-file") {
        await writeBinary(artifact.uri, artifact.content);
      } else {
        await writeString(artifact.uri, this.fixEol(artifact.content));
      }
      this.stats.writeCompleted++;
    };

    this.tasks.push(action());
  }

  /**
   * Wait for all artifact write tasks to complete.
   */
  async wait() {
    await Promise.all(this.tasks);
  }

  /**
   * Fix EOL configuration for content based on the config.
   * @param {string} content - The content to fix EOL.
   * @returns {string} - The content with fixed EOL.
   */
  fixEol(content) {
    const eol = this.config.eol;
    if (!eol || eol === "default") {
      return content;
    }

    const char = eol === "crlf" ? "\r\n" : "\n";
    return content.replace(/(\r\n|\n|\r)/gm, char);
  }
}
