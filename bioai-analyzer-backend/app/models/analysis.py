"""
Analysis database model.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from app.database import Base


class Analysis(Base):
    """
    Analysis model for storing sequence analysis history.
    """
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sequence_type = Column(String(20), nullable=False)  # DNA, RNA, or Protein
    input_sequence = Column(Text, nullable=False)
    results = Column(JSON, nullable=False)  # Store analysis results as JSON
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)

    # Relationship to User model
    user = relationship("User", back_populates="analyses")

    def __repr__(self):
        return f"<Analysis(id={self.id}, user_id={self.user_id}, sequence_type='{self.sequence_type}')>"


# Create index on created_at field (already handled by index=True in Column definition)
